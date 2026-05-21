-- Replace TABLE_NAME, RIGHT_VIEW, RIGHT_ADD, RIGHT_EDIT, RIGHT_DEL
ALTER TABLE "jobHistory" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "jh_select" ON "jobHistory" FOR SELECT
USING (
  record_status = 'ACTIVE'
  OR EXISTS (SELECT 1 FROM "user" u
    WHERE u."userId"=auth.uid()
      AND u.user_type IN ('ADMIN','SUPERADMIN'))
);

CREATE POLICY "jh_insert" ON "jobHistory" FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM "UserModule_Rights" umr
  WHERE umr."userId"=auth.uid()
    AND umr."rightCode"='JH_ADD' AND umr.right_value=1
));

-- Repeat same structure for job (JOB_*) and department (DEPT_*)