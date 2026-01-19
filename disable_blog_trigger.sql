-- Disable the redundant Audit Log trigger on blogs table
-- This trigger is causing type mismatch errors (UUID vs TEXT) and duplicating logs
-- typically handled by the application logic.

DROP TRIGGER IF EXISTS on_blog_action_audit ON public.blogs;
DROP FUNCTION IF EXISTS handle_blog_audit_log();
