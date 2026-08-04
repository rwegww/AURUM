SET LOCAL lock_timeout = '5s';
ALTER FUNCTION public.auth_session_is_current() SET SCHEMA aurum_auth;
GRANT USAGE ON SCHEMA aurum_auth TO authenticated, service_role;
REVOKE ALL ON FUNCTION aurum_auth.auth_session_is_current() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION aurum_auth.auth_session_is_current() TO authenticated, service_role;
NOTIFY pgrst, 'reload schema';
