-- /db/migrations/002_rights_seed.sql

-- Rights support tables
CREATE TABLE IF NOT EXISTS "Module" (
  moduleCode  VARCHAR(10) PRIMARY KEY,
  moduleName  VARCHAR(30),
  record_status VARCHAR(10) DEFAULT 'ACTIVE',
  stamp       VARCHAR(60)
);
CREATE TABLE IF NOT EXISTS rights (
  rightCode   VARCHAR(10) PRIMARY KEY,
  rightDesc   VARCHAR(30),
  right_value INT,
  moduleCode  VARCHAR(10) REFERENCES "Module"(moduleCode),
  record_status VARCHAR(10) DEFAULT 'ACTIVE',
  stamp       VARCHAR(60)
);
CREATE TABLE IF NOT EXISTS "user" (
  userId      UUID PRIMARY KEY,
  username    VARCHAR(30),
  user_type   VARCHAR(12),
  record_status VARCHAR(10) DEFAULT 'INACTIVE',
  stamp       VARCHAR(60)
);
CREATE TABLE IF NOT EXISTS user_module (
  userId      UUID REFERENCES "user"(userId),
  moduleCode  VARCHAR(10) REFERENCES "Module"(moduleCode),
  rights_value INT DEFAULT 0,
  PRIMARY KEY (userId, moduleCode)
);
CREATE TABLE IF NOT EXISTS "UserModule_Rights" (
  userId      UUID REFERENCES "user"(userId),
  rightCode   VARCHAR(10) REFERENCES rights(rightCode),
  right_value INT DEFAULT 0,
  PRIMARY KEY (userId, rightCode)
);

-- Seed modules
INSERT INTO "Module" VALUES
  ('Emp_Mod',  'Employee Module',    'ACTIVE','SEEDED'),
  ('JH_Mod',   'Job History Module', 'ACTIVE','SEEDED'),
  ('Job_Mod',  'Job Module',         'ACTIVE','SEEDED'),
  ('Dept_Mod', 'Department Module',  'ACTIVE','SEEDED'),
  ('Adm_Mod',  'Admin Module',       'ACTIVE','SEEDED');

-- Seed 17 rights
INSERT INTO rights VALUES
  ('EMP_VIEW','View Employees',1,'Emp_Mod','ACTIVE','SEEDED'),
  ('EMP_ADD','Add Employee',1,'Emp_Mod','ACTIVE','SEEDED'),
  ('EMP_EDIT','Edit Employee',1,'Emp_Mod','ACTIVE','SEEDED'),
  ('EMP_DEL','Soft Delete Employee',1,'Emp_Mod','ACTIVE','SEEDED'),
  ('JH_VIEW','View Job History',1,'JH_Mod','ACTIVE','SEEDED'),
  ('JH_ADD','Add Job History',1,'JH_Mod','ACTIVE','SEEDED'),
  ('JH_EDIT','Edit Job History',1,'JH_Mod','ACTIVE','SEEDED'),
  ('JH_DEL','Soft Delete Job History',1,'JH_Mod','ACTIVE','SEEDED'),
  ('JOB_VIEW','View Jobs',1,'Job_Mod','ACTIVE','SEEDED'),
  ('JOB_ADD','Add Job',1,'Job_Mod','ACTIVE','SEEDED'),
  ('JOB_EDIT','Edit Job',1,'Job_Mod','ACTIVE','SEEDED'),
  ('JOB_DEL','Soft Delete Job',1,'Job_Mod','ACTIVE','SEEDED'),
  ('DEPT_VIEW','View Departments',1,'Dept_Mod','ACTIVE','SEEDED'),
  ('DEPT_ADD','Add Department',1,'Dept_Mod','ACTIVE','SEEDED'),
  ('DEPT_EDIT','Edit Department',1,'Dept_Mod','ACTIVE','SEEDED'),
  ('DEPT_DEL','Soft Delete Department',1,'Dept_Mod','ACTIVE','SEEDED'),
  ('ADM_USER','Admin Activate User',1,'Adm_Mod','ACTIVE','SEEDED');

-- SUPERADMIN user seed (replace UUID with actual auth.users UUID)
-- Run AFTER auth.users has been created via Supabase Dashboard
INSERT INTO "user" VALUES (
  '<SUPERADMIN_UUID>',
  'jcesperanza',
  'SUPERADMIN',
  'ACTIVE',
  'SEEDED'
);
-- Then insert all 17 rights = 1 for SUPERADMIN in UserModule_Rights