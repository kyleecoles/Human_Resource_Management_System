-- /db/migrations/008_rls_admin_user.sql
-- S3 PR-02: Admin RLS — user table + SUPERADMIN guard

ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;

-- ADMIN and SUPERADMIN can SELECT all users
CREATE POLICY "user_select_admin" ON "user" FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "user" u
    WHERE u."userId" = auth.uid()
      AND u.user_type IN ('ADMIN','SUPERADMIN')
  )
);

-- ADMIN can UPDATE record_status ONLY if target is NOT SUPERADMIN
-- Cannot change user_type
CREATE POLICY "user_update_activate" ON "user" FOR UPDATE
USING (
  user_type != 'SUPERADMIN'
  AND EXISTS (
    SELECT 1 FROM "user" u
    WHERE u."userId" = auth.uid()
      AND u.user_type IN ('ADMIN','SUPERADMIN')
  )
)
WITH CHECK (
  user_type = (
    SELECT user_type FROM "user"
    WHERE "userId" = "user"."userId"
  )
);

-- Block ADMIN from modifying SUPERADMIN rights rows
ALTER TABLE "UserModule_Rights" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "umr_no_superadmin_edit" ON "UserModule_Rights" FOR UPDATE
USING (
  NOT EXISTS (
    SELECT 1 FROM "user" u
    WHERE u."userId" = "UserModule_Rights"."userId"
      AND u.user_type = 'SUPERADMIN'
  )
);

-- Verification query (run in Supabase after applying):
-- SELECT tablename, policyname, cmd FROM pg_policies
-- WHERE schemaname = 'public' AND tablename IN ('user','UserModule_Rights');
