-- /db/migrations/007_views_reports.sql
-- S3 PR-01: Report views — headcount_by_dept + salary_summary_by_job

-- View 1: Active employee count per department
CREATE OR REPLACE VIEW headcount_by_dept AS
SELECT
  d."deptCode",
  d."deptName",
  COUNT(DISTINCT latest.empno) AS headcount
FROM department d
LEFT JOIN LATERAL (
  SELECT jh."empNo" AS empno
  FROM "jobHistory" jh
  WHERE jh."deptCode" = d."deptCode"
    AND jh.record_status = 'ACTIVE'
    AND jh."effDate" = (
      SELECT MAX(jh2."effDate")
      FROM "jobHistory" jh2
      WHERE jh2."empNo" = jh."empNo"
        AND jh2.record_status = 'ACTIVE'
    )
) latest ON true
WHERE d.record_status = 'ACTIVE'
GROUP BY d."deptCode", d."deptName"
ORDER BY headcount DESC;

-- View 2: Min/max/avg salary per active job
CREATE OR REPLACE VIEW salary_summary_by_job AS
SELECT
  j."jobCode",
  j."jobDesc",
  MIN(jh.salary)  AS min_salary,
  MAX(jh.salary)  AS max_salary,
  ROUND(AVG(jh.salary)::numeric, 2) AS avg_salary,
  COUNT(DISTINCT jh."empNo") AS employee_count
FROM job j
JOIN "jobHistory" jh ON jh."jobCode" = j."jobCode"
WHERE jh.record_status = 'ACTIVE'
  AND j.record_status = 'ACTIVE'
GROUP BY j."jobCode", j."jobDesc"
ORDER BY avg_salary DESC;

-- Verification queries (run in Supabase after applying):
-- SELECT * FROM headcount_by_dept;
-- SELECT * FROM salary_summary_by_job;
