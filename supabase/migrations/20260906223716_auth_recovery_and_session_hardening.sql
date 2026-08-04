SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

CREATE SCHEMA IF NOT EXISTS aurum_auth;
REVOKE ALL ON SCHEMA aurum_auth FROM PUBLIC, anon, authenticated;

CREATE TABLE aurum_auth.rate_limits (
  key text PRIMARY KEY CHECK (key ~ '^[0-9a-f]{64}$'),
  hits integer NOT NULL CHECK (hits > 0),
  expires_at timestamptz NOT NULL
);
CREATE INDEX auth_rate_limits_expiry ON aurum_auth.rate_limits (expires_at);

CREATE TABLE aurum_auth.challenges (
  email text NOT NULL,
  purpose text NOT NULL CHECK (purpose IN ('login', 'reset')),
  id uuid NOT NULL UNIQUE,
  nguoi_dung_id text REFERENCES public.nguoi_dung(id) ON DELETE CASCADE,
  token_hash text NOT NULL CHECK (token_hash ~ '^[0-9a-f]{64}$'),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts BETWEEN 0 AND 5),
  sent_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  PRIMARY KEY (email, purpose)
);
CREATE INDEX auth_challenges_user ON aurum_auth.challenges (nguoi_dung_id);
CREATE INDEX auth_challenges_expiry ON aurum_auth.challenges (expires_at);
ALTER TABLE aurum_auth.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE aurum_auth.challenges ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON ALL TABLES IN SCHEMA aurum_auth FROM PUBLIC, anon, authenticated;

ALTER TABLE public.nguoi_dung ADD COLUMN auth_invalid_before timestamptz NOT NULL DEFAULT 'epoch';
COMMENT ON COLUMN public.nguoi_dung.auth_invalid_before IS 'Các phiên OAuth tạo trước mốc này không được API AURUM chấp nhận; đổi mật khẩu/email sẽ cập nhật mốc.';
CREATE UNIQUE INDEX nguoi_dung_email_normalized_unique ON public.nguoi_dung (lower(btrim(email))) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX nguoi_dung_google_identity_unique ON public.nguoi_dung ((tai_khoan_lien_ket->>'google')) WHERE tai_khoan_lien_ket->>'google' IS NOT NULL;

-- Băm mật khẩu và trạng thái thu hồi phiên không được trả qua Data API cho client.
REVOKE SELECT, INSERT, DELETE ON public.nguoi_dung FROM PUBLIC, anon, authenticated;
GRANT SELECT (id, username, email, role, avatar_seed, diem_kinh_nghiem, cap_do,
  thong_ke_dau, created_at, updated_at, hoat_dong_cuoi_luc, phut_hoat_dong,
  bi_khoa, so_ngay_chuoi, chuoi_cuoi_luc, phut_online_hom_nay,
  da_hoan_thanh_bai_hom_nay, ke_hoach_hoc, tai_khoan_lien_ket)
ON public.nguoi_dung TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nguoi_dung TO service_role;

CREATE FUNCTION public.consume_auth_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r aurum_auth.rate_limits; t timestamptz := clock_timestamp();
BEGIN
  IF p_key IS NULL OR p_key !~ '^[0-9a-f]{64}$' OR p_limit IS NULL OR p_limit NOT BETWEEN 1 AND 1000
    OR p_window_seconds IS NULL OR p_window_seconds NOT BETWEEN 1 AND 86400 THEN
    RAISE EXCEPTION 'Invalid rate limit parameters';
  END IF;
  -- Cleanup runs in its own RPC transaction, before any account/challenge lock.
  DELETE FROM aurum_auth.challenges WHERE expires_at < t - interval '1 day';
  DELETE FROM aurum_auth.rate_limits WHERE expires_at < t - interval '1 hour';
  INSERT INTO aurum_auth.rate_limits AS old (key, hits, expires_at)
  VALUES (p_key, 1, t + make_interval(secs => p_window_seconds))
  ON CONFLICT (key) DO UPDATE SET
    hits = CASE WHEN old.expires_at <= t THEN 1 ELSE least(old.hits + 1, p_limit + 1) END,
    expires_at = CASE WHEN old.expires_at <= t THEN t + make_interval(secs => p_window_seconds) ELSE old.expires_at END
  RETURNING * INTO r;
  RETURN CASE WHEN r.hits <= p_limit THEN 0 ELSE greatest(1, ceil(extract(epoch FROM r.expires_at - t))::integer) END;
END;
$$;

CREATE FUNCTION public.issue_auth_challenge(p_email text, p_purpose text, p_token_hash text, p_challenge_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE u public.nguoi_dung; issued_id uuid; t timestamptz := clock_timestamp();
BEGIN
  IF p_email IS NULL OR length(p_email) NOT BETWEEN 3 AND 320 OR p_email <> lower(btrim(p_email))
    OR p_purpose IS NULL OR p_purpose NOT IN ('login','reset')
    OR p_token_hash IS NULL OR p_token_hash !~ '^[0-9a-f]{64}$' OR p_challenge_id IS NULL THEN
    RAISE EXCEPTION 'Invalid challenge parameters';
  END IF;
  SELECT * INTO u FROM public.nguoi_dung WHERE lower(btrim(email)) = p_email FOR UPDATE;
  IF u.bi_khoa THEN u.id := NULL; END IF;
  t := clock_timestamp();
  INSERT INTO aurum_auth.challenges AS old (email, purpose, id, nguoi_dung_id, token_hash, sent_at, expires_at)
  VALUES (p_email, p_purpose, p_challenge_id, u.id, p_token_hash, t, t + interval '10 minutes')
  ON CONFLICT (email, purpose) DO UPDATE SET
    id = excluded.id, nguoi_dung_id = excluded.nguoi_dung_id, token_hash = excluded.token_hash,
    attempts = 0, sent_at = excluded.sent_at, expires_at = excluded.expires_at, consumed_at = NULL
  WHERE old.sent_at <= t - interval '60 seconds'
  RETURNING id INTO issued_id;
  RETURN jsonb_build_object('issued', issued_id IS NOT NULL, 'user_id', u.id, 'username', u.username);
END;
$$;

CREATE FUNCTION public.complete_auth_challenge(p_email text, p_purpose text, p_token_hash text, p_password_hash text, p_session_id text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE c aurum_auth.challenges; u public.nguoi_dung; candidate text; t timestamptz := clock_timestamp();
BEGIN
  IF p_purpose IS NULL OR p_purpose NOT IN ('login','reset') OR p_token_hash IS NULL OR p_token_hash !~ '^[0-9a-f]{64}$' THEN
    RETURN NULL;
  END IF;
  IF (p_purpose = 'reset' AND (p_password_hash IS NULL OR p_password_hash !~ '^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$'))
    OR (p_purpose = 'login' AND (p_password_hash IS NOT NULL OR p_session_id IS NULL OR length(p_session_id) NOT BETWEEN 16 AND 128)) THEN
    RETURN NULL;
  END IF;
  SELECT nguoi_dung_id INTO candidate FROM aurum_auth.challenges WHERE email = p_email AND purpose = p_purpose;
  -- Account first, then challenge: same lock order as issue and password changes.
  SELECT * INTO u FROM public.nguoi_dung WHERE id = candidate FOR UPDATE;
  SELECT * INTO c FROM aurum_auth.challenges WHERE email = p_email AND purpose = p_purpose FOR UPDATE;
  t := clock_timestamp();
  IF c.id IS NULL OR c.expires_at <= t OR c.consumed_at IS NOT NULL OR c.attempts >= 5 THEN RETURN NULL; END IF;
  UPDATE aurum_auth.challenges SET attempts = attempts + 1 WHERE id = c.id;
  IF c.token_hash <> p_token_hash OR u.id IS NULL OR u.bi_khoa OR c.nguoi_dung_id IS DISTINCT FROM u.id
    OR lower(btrim(u.email)) IS DISTINCT FROM p_email THEN RETURN NULL; END IF;
  UPDATE aurum_auth.challenges SET consumed_at = t WHERE id = c.id;
  IF p_purpose = 'reset' THEN
    UPDATE public.nguoi_dung SET password_hash = p_password_hash, updated_at = t WHERE id = u.id;
    RETURN jsonb_build_object('user_id', u.id);
  END IF;
  UPDATE public.nguoi_dung SET current_session_id = p_session_id WHERE id = u.id;
  RETURN jsonb_build_object('user_id', u.id, 'session_id', p_session_id);
END;
$$;

CREATE FUNCTION public.create_auth_session(p_user_id text, p_expected_password_hash text, p_session_id text)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = '' AS $$
  WITH changed AS (
    UPDATE public.nguoi_dung SET current_session_id = p_session_id
    WHERE id = p_user_id AND password_hash = p_expected_password_hash AND NOT bi_khoa
      AND p_session_id IS NOT NULL AND length(p_session_id) BETWEEN 16 AND 128
    RETURNING id
  ) SELECT EXISTS (SELECT 1 FROM changed);
$$;

CREATE FUNCTION aurum_auth.invalidate_credentials()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NEW.password_hash IS DISTINCT FROM OLD.password_hash OR NEW.email IS DISTINCT FROM OLD.email THEN
    NEW.current_session_id := NULL;
    NEW.auth_invalid_before := clock_timestamp();
    DELETE FROM aurum_auth.challenges WHERE nguoi_dung_id = OLD.id;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER invalidate_credentials BEFORE UPDATE OF password_hash, email ON public.nguoi_dung
  FOR EACH ROW EXECUTE FUNCTION aurum_auth.invalidate_credentials();

CREATE FUNCTION public.is_oauth_session_active(p_session_id uuid, p_auth_user_id uuid, p_user_id text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.sessions s JOIN public.nguoi_dung u ON u.id = p_user_id
    WHERE s.id = p_session_id AND s.user_id = p_auth_user_id AND NOT u.bi_khoa
      AND s.created_at > u.auth_invalid_before
      AND (s.not_after IS NULL OR s.not_after > now())
  );
$$;

REVOKE ALL ON FUNCTION public.consume_auth_rate_limit(text,integer,integer),
  public.issue_auth_challenge(text,text,text,uuid), public.complete_auth_challenge(text,text,text,text,text),
  public.create_auth_session(text,text,text), public.is_oauth_session_active(uuid,uuid,text)
FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_auth_rate_limit(text,integer,integer),
  public.issue_auth_challenge(text,text,text,uuid), public.complete_auth_challenge(text,text,text,text,text),
  public.create_auth_session(text,text,text), public.is_oauth_session_active(uuid,uuid,text)
TO service_role;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA aurum_auth FROM PUBLIC, anon, authenticated;
NOTIFY pgrst, 'reload schema';
