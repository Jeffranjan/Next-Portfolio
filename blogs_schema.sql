-- -----------------------------------------------------------------------------
-- 1. SETUP & UTILS
-- -----------------------------------------------------------------------------

-- Create audit_logs table if it doesn't exist (inferred schema from requirements)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    admin_email TEXT,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    details JSONB
);

-- Enable RLS on audit_logs if newly created
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 2. CREATE BLOGS TABLE
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    published_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ, -- Soft delete
    
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    excerpt TEXT,
    content JSONB, -- Stores rich editor output
    cover_image TEXT,
    
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN DEFAULT false NOT NULL,
    
    reading_time INT DEFAULT 0,
    views INT DEFAULT 0,
    
    seo_title TEXT,
    seo_description TEXT,

    -- Validation Rules via Constraints
    CONSTRAINT blogs_slug_key UNIQUE (slug),
    CONSTRAINT check_published_requirements CHECK (
        status <> 'published' OR (
            title IS NOT NULL AND 
            slug IS NOT NULL AND 
            content IS NOT NULL
        )
    )
);

-- -----------------------------------------------------------------------------
-- 3. INDEXES
-- -----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON public.blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON public.blogs(featured);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON public.blogs(published_at);
CREATE INDEX IF NOT EXISTS idx_blogs_author_id ON public.blogs(author_id);

-- -----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS)
-- -----------------------------------------------------------------------------

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read published, non-deleted blogs
CREATE POLICY "Public can view published blogs" ON public.blogs
    FOR SELECT
    USING (
        status = 'published' AND 
        deleted_at IS NULL
    );

-- Policy: Authenticated Admins can do everything
-- Note: Adjust 'auth.role() = ''authenticated''' to specific admin roles if your app supports it.
-- For now, per requirements: "Only authenticated users can INSERT, UPDATE, DELETE"
CREATE POLICY "Admins can manage all blogs" ON public.blogs
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- 5. TRIGGERS & FUNCTIONS
-- -----------------------------------------------------------------------------

-- Trigger A: Auto-update `updated_at`
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_update_set_updated_at
    BEFORE UPDATE ON public.blogs
    FOR EACH ROW
    EXECUTE PROCEDURE handle_updated_at();

-- Trigger B: Auto-set `published_at` when status changes to 'published'
CREATE OR REPLACE FUNCTION handle_published_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'published' AND (OLD.status IS DISTINCT FROM 'published') THEN
        NEW.published_at = now();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_publish_set_published_at
    BEFORE UPDATE ON public.blogs
    FOR EACH ROW
    WHEN (NEW.status = 'published' AND OLD.status <> 'published')
    EXECUTE PROCEDURE handle_published_at();

-- Trigger C: Audit Logging (DISABLED - Managed by Application Logic)
-- CREATE OR REPLACE FUNCTION handle_blog_audit_log()
-- RETURNS TRIGGER AS $$
-- DECLARE
--     current_admin_email TEXT;
--     audit_action TEXT;
--     audit_details JSONB;
-- BEGIN
--     -- Try to get email from jwt claims (works if using Supabase Auth)
--     current_admin_email := auth.jwt() ->> 'email';
--     
--     IF (TG_OP = 'INSERT') THEN
--         audit_action := 'CREATE';
--         audit_details := jsonb_build_object('title', NEW.title, 'slug', NEW.slug);
--     ELSIF (TG_OP = 'UPDATE') THEN
--         IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
--             audit_action := 'DELETE'; -- Soft delete
--         ELSIF NEW.deleted_at IS NULL AND OLD.deleted_at IS NOT NULL THEN
--             audit_action := 'RESTORE';
--         ELSE
--             audit_action := 'UPDATE';
--         END IF;
--         audit_details := jsonb_build_object(
--             'changes', 
--             (to_jsonb(NEW) - 'content' - 'created_at' - 'updated_at') -- Exclude heavy/static fields
--         );
--     ELSIF (TG_OP = 'DELETE') THEN
--         audit_action := 'HARD_DELETE';
--         audit_details := jsonb_build_object('id', OLD.id, 'title', OLD.title);
--     END IF;
-- 
--     INSERT INTO public.audit_logs (
--         admin_email,
--         action,
--         entity,
--         entity_id,
--         details
--     ) VALUES (
--         current_admin_email,
--         audit_action,
--         'BLOGS',
--         COALESCE(NEW.id, OLD.id)::text,
--         audit_details
--     );
-- 
--     RETURN NULL; -- Return value ignored for AFTER triggers
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
-- 
-- CREATE TRIGGER on_blog_action_audit
--     AFTER INSERT OR UPDATE OR DELETE ON public.blogs
--     FOR EACH ROW
--     EXECUTE PROCEDURE handle_blog_audit_log();
