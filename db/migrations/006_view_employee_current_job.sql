-- /db/migrations/006_view_employee_current_job.sql
-- S2 PR-04: SQL view — employee_current_job

CREATE OR REPLACE VIEW employee_current_job AS
SELECT
  e.empno,
  e.lastname,
  e.firstname,
  e.gender,
  e.hiredate,
  e."sepDate",
  e.record_status,
  e.stamp,
  jh."jobCode",
  j."jobDesc",
  jh."deptCode",
  d."deptName",
  jh.salary,
  jh."effDate"
FROM employee e
LEFT JOIN LATERAL (
  SELECT *
  FROM "jobHistory" jh2
  WHERE jh2."empNo" = e.empno
    AND jh2.record_status = 'ACTIVE'
  ORDER BY jh2."effDate" DESC
  LIMIT 1
) jh ON true
LEFT JOIN job j ON j."jobCode" = jh."jobCode"
LEFT JOIN department d ON d."deptCode" = jh."deptCode";

-- Verification query (run in Supabase after applying):
-- SELECT empno, lastname, "jobDesc", "deptName", salary
-- FROM employee_current_job
-- LIMIT 10;
