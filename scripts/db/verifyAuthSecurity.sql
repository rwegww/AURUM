-- Chỉ dùng dữ liệu thử trong transaction; không gửi email, không sửa tài khoản thật.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';
DO $$
DECLARE
  uid text := gen_random_uuid()::text;
  mail text := 'auth-audit-' || gen_random_uuid()::text || '@example.invalid';
  old_hash text := '$2b$12$' || repeat('a', 53);
  new_hash text := '$2b$12$' || repeat('b', 53);
  result jsonb;
  key text := encode(extensions.digest(gen_random_uuid()::text, 'sha256'), 'hex');
  auth_session auth.sessions;
  checks text[] := ARRAY[]::text[];
BEGIN
  INSERT INTO public.nguoi_dung(id, username, email, password_hash, current_session_id)
  VALUES(uid, 'auth_audit_' || uid, mail, old_hash, 'old-fixture-session');
  PERFORM set_config('aurum.auth_fixture_id', uid, true);
  PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',uid,'role','authenticated',
    'iat',extract(epoch FROM now() - interval '30 seconds')::bigint,
    'exp',extract(epoch FROM now() + interval '14 minutes')::bigint)::text,true);
  IF aurum_auth.auth_session_is_current() IS DISTINCT FROM true THEN RAISE EXCEPTION 'Legacy Arena token rejected'; END IF;

  IF public.consume_auth_rate_limit(key, 2, 60) IS DISTINCT FROM 0
    OR public.consume_auth_rate_limit(key, 2, 60) IS DISTINCT FROM 0
    OR public.consume_auth_rate_limit(key, 2, 60) <= 0 THEN RAISE EXCEPTION 'Rate limit failed'; END IF;
  checks := array_append(checks, 'persistent_rate_limit');

  result := public.issue_auth_challenge(mail, 'login', repeat('a',64), gen_random_uuid());
  IF result->>'user_id' IS DISTINCT FROM uid OR result->>'issued' IS DISTINCT FROM 'true' THEN
    RAISE EXCEPTION 'Issue challenge failed'; END IF;
  result := public.issue_auth_challenge(mail, 'login', repeat('b',64), gen_random_uuid());
  IF result->>'issued' IS DISTINCT FROM 'false' THEN RAISE EXCEPTION 'Cooldown failed'; END IF;
  checks := array_append(checks, 'resend_cooldown');

  IF public.complete_auth_challenge(mail,'reset',repeat('a',64),new_hash,'fixture-session-id') IS NOT NULL THEN
    RAISE EXCEPTION 'Cross-purpose code accepted'; END IF;
  checks := array_append(checks, 'purpose_separation');

  FOR i IN 1..5 LOOP
    IF public.complete_auth_challenge(mail,'login',repeat('c',64),NULL,'fixture-session-id') IS NOT NULL THEN
      RAISE EXCEPTION 'Wrong code accepted'; END IF;
  END LOOP;
  IF public.complete_auth_challenge(mail,'login',repeat('a',64),NULL,'fixture-session-id') IS NOT NULL THEN
    RAISE EXCEPTION 'Attempts limit bypass'; END IF;
  checks := array_append(checks, 'five_attempts_limit');

  UPDATE aurum_auth.challenges SET sent_at = now() - interval '2 minutes' WHERE nguoi_dung_id = uid;
  PERFORM public.issue_auth_challenge(mail,'login',repeat('d',64),gen_random_uuid());
  IF public.complete_auth_challenge(mail,'login',repeat('a',64),NULL,'fixture-session-id') IS NOT NULL THEN
    RAISE EXCEPTION 'Superseded code accepted'; END IF;
  result := public.complete_auth_challenge(mail,'login',repeat('d',64),NULL,'fixture-session-id');
  IF result->>'session_id' IS DISTINCT FROM 'fixture-session-id' THEN RAISE EXCEPTION 'Login failed'; END IF;
  IF public.complete_auth_challenge(mail,'login',repeat('d',64),NULL,'another-fixture-session') IS NOT NULL THEN
    RAISE EXCEPTION 'Code replay accepted'; END IF;
  checks := array_append(checks, 'superseded_and_consumed_codes_rejected');

  PERFORM public.issue_auth_challenge(mail,'reset',repeat('e',64),gen_random_uuid());
  UPDATE aurum_auth.challenges SET expires_at = now() - interval '1 second' WHERE email = mail AND purpose = 'reset';
  IF public.complete_auth_challenge(mail,'reset',repeat('e',64),new_hash,'fixture-session-id') IS NOT NULL THEN
    RAISE EXCEPTION 'Expired code accepted'; END IF;
  checks := array_append(checks, 'expired_code_rejected');

  UPDATE aurum_auth.challenges SET expires_at = now() + interval '1 minute' WHERE email = mail AND purpose = 'reset';
  result := public.complete_auth_challenge(mail,'reset',repeat('e',64),new_hash,'fixture-session-id');
  IF result->>'user_id' IS DISTINCT FROM uid OR NOT EXISTS (
    SELECT 1 FROM public.nguoi_dung WHERE id = uid AND password_hash = new_hash
      AND current_session_id IS NULL AND auth_invalid_before > 'epoch'::timestamptz
  ) THEN RAISE EXCEPTION 'Atomic reset or session revocation failed'; END IF;
  IF EXISTS (SELECT 1 FROM aurum_auth.challenges WHERE nguoi_dung_id = uid) THEN
    RAISE EXCEPTION 'Outstanding code survived reset'; END IF;
  checks := array_append(checks, 'reset_updates_password_and_revokes_sessions_and_codes');

  IF public.create_auth_session(uid, old_hash, 'outdated-password-session') IS DISTINCT FROM false THEN
    RAISE EXCEPTION 'Password-reset race allowed stale password login'; END IF;
  IF public.create_auth_session(uid, new_hash, 'new-password-session') IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'New password session failed'; END IF;
  checks := array_append(checks, 'password_login_compare_and_swap');
  IF aurum_auth.auth_session_is_current() IS DISTINCT FROM false THEN RAISE EXCEPTION 'Old Arena token revived after new login'; END IF;
  checks := array_append(checks, 'old_realtime_token_stays_revoked_after_login');

  PERFORM public.issue_auth_challenge(mail,'login',repeat('f',64),gen_random_uuid());
  UPDATE public.nguoi_dung SET bi_khoa = true WHERE id = uid;
  IF public.complete_auth_challenge(mail,'login',repeat('f',64),NULL,'locked-fixture-session') IS NOT NULL
    OR public.create_auth_session(uid,new_hash,'locked-fixture-session') IS DISTINCT FROM false THEN
    RAISE EXCEPTION 'Locked account authenticated'; END IF;
  checks := array_append(checks, 'locked_account_rejected');
  UPDATE public.nguoi_dung SET bi_khoa = false WHERE id = uid;

  -- Read session metadata only; apply the revocation cutoff to the fixture profile.
  SELECT * INTO auth_session FROM auth.sessions WHERE not_after IS NULL OR not_after > now() LIMIT 1;
  IF FOUND THEN
    UPDATE public.nguoi_dung SET auth_invalid_before = 'epoch' WHERE id = uid;
    IF public.is_oauth_session_active(auth_session.id,auth_session.user_id,uid) IS DISTINCT FROM true THEN
      RAISE EXCEPTION 'Existing OAuth session incorrectly rejected'; END IF;
    UPDATE public.nguoi_dung SET auth_invalid_before = clock_timestamp() WHERE id = uid;
    IF public.is_oauth_session_active(auth_session.id,auth_session.user_id,uid) IS DISTINCT FROM false THEN
      RAISE EXCEPTION 'Old OAuth session survives credential reset'; END IF;
    checks := array_append(checks, 'oauth_session_creation_cutoff');
  END IF;
  IF public.is_oauth_session_active(gen_random_uuid(),gen_random_uuid(),uid) IS DISTINCT FROM false THEN
    RAISE EXCEPTION 'Missing OAuth session accepted'; END IF;
  checks := array_append(checks, 'missing_oauth_session_rejected');
  PERFORM set_config('aurum.auth_checks', to_jsonb(checks)::text, true);
END;
$$;

SET LOCAL ROLE authenticated;
DO $$
DECLARE denied boolean := false;
BEGIN
  PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('aurum.auth_fixture_id'),'role','authenticated','app_session_id','new-password-session')::text,true);
  PERFORM set_config('request.jwt.claim.sub',current_setting('aurum.auth_fixture_id'),true);
  BEGIN PERFORM password_hash FROM public.nguoi_dung;
  EXCEPTION WHEN insufficient_privilege THEN denied := true; END;
  IF NOT denied THEN RAISE EXCEPTION 'Password hashes readable by client'; END IF;
  denied := false;
  BEGIN PERFORM public.issue_auth_challenge('audit@example.invalid','reset',repeat('a',64),gen_random_uuid());
  EXCEPTION WHEN insufficient_privilege THEN denied := true; END;
  IF NOT denied THEN RAISE EXCEPTION 'Client can issue challenge'; END IF;
  denied := false;
  BEGIN PERFORM token_hash FROM aurum_auth.challenges;
  EXCEPTION WHEN insufficient_privilege THEN denied := true; END;
  IF NOT denied THEN RAISE EXCEPTION 'Client can read challenge storage'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.nguoi_dung WHERE id = current_setting('aurum.auth_fixture_id')) THEN
    RAISE EXCEPTION 'Valid session cannot read own profile'; END IF;
  PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('aurum.auth_fixture_id'),
    'role','authenticated','app_session_id','old-fixture-session')::text,true);
  IF EXISTS (SELECT 1 FROM public.nguoi_dung WHERE id = current_setting('aurum.auth_fixture_id')) THEN
    RAISE EXCEPTION 'Old session bypassed Data API RLS'; END IF;
END;
$$;
RESET ROLE;
SELECT current_setting('aurum.auth_checks')::jsonb || '["client_hash_read_denied","client_challenge_rpc_denied","private_challenges_read_denied","own_profile_read_available","stale_session_cannot_read_own_profile"]'::jsonb AS passed_checks;
ROLLBACK;
