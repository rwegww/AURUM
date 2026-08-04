SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

-- Called by RLS for the current signed identity only, never an arbitrary user id.
CREATE OR REPLACE FUNCTION public.auth_session_is_current()
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  claims jsonb := auth.jwt();
  subject text := auth.uid()::text;
  u public.nguoi_dung;
  session_id text := claims->>'session_id';
  auth_user_id text := coalesce(claims->>'aurum_auth_user_id', subject);
BEGIN
  IF subject IS NULL THEN RETURN false; END IF;
  SELECT * INTO u FROM public.nguoi_dung
    WHERE id = subject OR tai_khoan_lien_ket->>'google' = subject
    ORDER BY (tai_khoan_lien_ket->>'google' = subject) DESC NULLS LAST LIMIT 1;
  IF u.id IS NULL OR u.bi_khoa THEN RETURN false; END IF;
  IF session_id IS NOT NULL THEN
    IF session_id !~ '^[0-9a-fA-F-]{36}$' OR auth_user_id !~ '^[0-9a-fA-F-]{36}$' THEN RETURN false; END IF;
    RETURN EXISTS (SELECT 1 FROM auth.sessions s
      WHERE s.id = session_id::uuid AND s.user_id = auth_user_id::uuid
        AND s.created_at > u.auth_invalid_before AND (s.not_after IS NULL OR s.not_after > now()));
  END IF;
  IF claims ? 'app_session_id' THEN
    RETURN u.current_session_id IS NOT NULL AND u.current_session_id = claims->>'app_session_id';
  END IF;
  -- Compatibility for existing 15-minute Arena tokens until they expire.
  -- Password resets still reject them even after the user logs in again.
  IF claims->>'iat' IS NULL OR claims->>'exp' IS NULL OR claims->>'iat' !~ '^[0-9]{1,12}$' OR claims->>'exp' !~ '^[0-9]{1,12}$' THEN RETURN false; END IF;
  RETURN to_timestamp((claims->>'iat')::double precision) > u.auth_invalid_before
    AND (claims->>'exp')::bigint - (claims->>'iat')::bigint BETWEEN 1 AND 900
    AND to_timestamp((claims->>'exp')::double precision) > now();
EXCEPTION WHEN invalid_text_representation OR numeric_value_out_of_range THEN
  RETURN false;
END;
$$;
REVOKE ALL ON FUNCTION public.auth_session_is_current() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.auth_session_is_current() TO authenticated, service_role;

DO $$
DECLARE item record;
BEGIN
  FOR item IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('CREATE POLICY "Require current authentication session" ON public.%I AS RESTRICTIVE FOR ALL TO authenticated USING ((SELECT public.auth_session_is_current())) WITH CHECK ((SELECT public.auth_session_is_current()))', item.tablename);
  END LOOP;
END;
$$;
NOTIFY pgrst, 'reload schema';
