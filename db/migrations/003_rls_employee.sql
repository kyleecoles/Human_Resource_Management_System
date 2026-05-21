-- /db/migrations/003_rls_employee.sql

ALTER TABLE employee ENABLE ROW LEVEL SECURITY;

-- SELECT: USER sees ACTIVE only; ADMIN/SUPERADMIN see all
CREATE POLICY "employee_select" ON employee FOR SELECT
USING (
  record_status = 'ACTIVE'
  OR EXISTS (
    SELECT 1 FROM "user" u
    WHERE u."userId" = auth.uid()
      AND u.user_type IN ('ADMIN','SUPERADMIN')
  )
);

-- INSERT: requires EMP_ADD right = 1
CREATE POLICY "employee_insert" ON employee FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "UserModule_Rights" umr
    WHERE umr."userId" = auth.uid()
      AND umr."rightCode" = 'EMP_ADD'
      AND umr.right_value = 1
  )
);

-- UPDATE (edit fields): requires EMP_EDIT = 1
CREATE POLICY "employee_update_edit" ON employee FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM "UserModule_Rights" umr
    WHERE umr."userId" = auth.uid()
      AND umr."rightCode" = 'EMP_EDIT'
      AND umr.right_value = 1
  )
);

-- UPDATE (soft delete / recover): EMP_DEL=1 or ADMIN/SUPERADMIN
CREATE POLICY "employee_update_status" ON employee FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM "UserModule_Rights" umr
    JOIN "user" u ON u."userId" = auth.uid()
    WHERE umr."userId" = auth.uid()
      AND ((umr."rightCode"='EMP_DEL' AND umr.right_value=1)
           OR u.user_type IN ('ADMIN','SUPERADMIN'))
  )
);