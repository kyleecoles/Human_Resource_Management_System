 /db/verify/001_verify_seed.sql

-- Row count checks (expected: 31, 8, 14, 54)
SELECT 'employee'   AS tbl, COUNT(*) FROM employee;
SELECT 'department' AS tbl, COUNT(*) FROM department;
SELECT 'job'        AS tbl, COUNT(*) FROM job;
SELECT 'jobHistory' AS tbl, COUNT(*) FROM "jobHistory";

-- Rights checks
SELECT 'modules' AS tbl, COUNT(*) FROM "Module";   -- expect 5
SELECT 'rights'  AS tbl, COUNT(*) FROM rights;      -- expect 17

-- FK integrity: all jobHistory empNo exist in employee
SELECT COUNT(*) AS orphan_empNo
FROM "jobHistory" jh
LEFT JOIN employee e ON jh."empNo" = e.empno
WHERE e.empno IS NULL;   -- expect 0

-- record_status defaults correct
SELECT record_status, COUNT(*) FROM employee
GROUP BY record_status;  -- all should be ACTIVE