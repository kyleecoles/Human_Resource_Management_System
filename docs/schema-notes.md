# HopeHRS — Database Schema Notes

**Project:** HopeHRS Human Resource Management System  
**Database:** Supabase (PostgreSQL)  
**Engineer:** M3 – Backend / Database Engineer  
**Sprint:** 1 · PR-03  

---

## Soft-delete rule (applies to ALL tables)

No row is ever permanently deleted. Instead, `record_status` is set to `'INACTIVE'`. To restore a record, set it back to `'ACTIVE'`. The `stamp` column records the last operation (e.g. `'SEEDED'`, `'CASCADE:...'`).

---

## HR tables (4 core tables)

### department
Stores all company departments.

| Column | Type | Notes |
|---|---|---|
| deptCode | VARCHAR(3) | Primary key |
| deptName | VARCHAR(20) | Display name |
| record_status | VARCHAR(10) | Default: `'ACTIVE'` |
| stamp | VARCHAR(60) | Last operation label |

Seeded with 8 rows from HopeDB.

---

### job
Stores all job titles/descriptions.

| Column | Type | Notes |
|---|---|---|
| jobCode | VARCHAR(4) | Primary key |
| jobDesc | VARCHAR(20) | Job title |
| record_status | VARCHAR(10) | Default: `'ACTIVE'` |
| stamp | VARCHAR(60) | Last operation label |

Seeded with 14 rows from HopeDB.

---

### employee
Stores all employee personal records.

| Column | Type | Notes |
|---|---|---|
| empno | VARCHAR(5) | Primary key |
| lastname | VARCHAR(15) | |
| firstname | VARCHAR(15) | |
| gender | CHAR(1) | CHECK: `'M'` or `'F'` |
| birthdate | DATE | |
| hiredate | DATE | |
| sepDate | DATE | Separation/exit date, nullable |
| record_status | VARCHAR(10) | Default: `'ACTIVE'` |
| stamp | VARCHAR(60) | Last operation label |

Seeded with 31 rows from HopeDB.

---

### jobHistory
Stores the full job assignment history per employee. An employee can have multiple rows (one per job change).

| Column | Type | Notes |
|---|---|---|
| empNo | VARCHAR(5) | FK → employee.empno |
| jobCode | VARCHAR(4) | FK → job.jobCode |
| effDate | DATE | Effective date of assignment |
| salary | DECIMAL(10,2) | CHECK: ≥ 0 |
| deptCode | VARCHAR(3) | FK → department.deptCode |
| record_status | VARCHAR(10) | Default: `'ACTIVE'` |
| stamp | VARCHAR(60) | Last operation label |

**Composite primary key:** (empNo, jobCode, effDate)  
Seeded with 54 rows from HopeDB.

**Cascade rule:** When an employee's `record_status` changes, ALL their jobHistory rows automatically follow via trigger `trg_cascade_employee_status`.

---

## Rights / user tables (5 support tables)

### Module
Defines the 5 modules of the system.

| Column | Type | Notes |
|---|---|---|
| moduleCode | VARCHAR(10) | Primary key |
| moduleName | VARCHAR(30) | |
| record_status | VARCHAR(10) | Default: `'ACTIVE'` |
| stamp | VARCHAR(60) | |

Seeded values: `Emp_Mod`, `JH_Mod`, `Job_Mod`, `Dept_Mod`, `Adm_Mod`

---

### rights
Defines the 17 specific rights in the system (4 per HR module + 1 admin right).

| Column | Type | Notes |
|---|---|---|
| rightCode | VARCHAR(10) | Primary key |
| rightDesc | VARCHAR(30) | |
| right_value | INT | 1 = granted |
| moduleCode | VARCHAR(10) | FK → Module.moduleCode |
| record_status | VARCHAR(10) | Default: `'ACTIVE'` |
| stamp | VARCHAR(60) | |

---

### user
Stores authenticated users. Linked to Supabase `auth.users` via UUID.

| Column | Type | Notes |
|---|---|---|
| userId | UUID | Primary key — matches auth.users |
| username | VARCHAR(30) | |
| user_type | VARCHAR(12) | `'USER'`, `'ADMIN'`, or `'SUPERADMIN'` |
| record_status | VARCHAR(10) | Default: `'INACTIVE'` (activated by ADMIN) |
| stamp | VARCHAR(60) | |

---

### user_module
Stores the aggregate rights bitmask per user per module.

| Column | Type | Notes |
|---|---|---|
| userId | UUID | FK → user.userId |
| moduleCode | VARCHAR(10) | FK → Module.moduleCode |
| rights_value | INT | Aggregate value, default 0 |

**Composite primary key:** (userId, moduleCode)

---

### UserModule_Rights
Stores the individual right grant per user (right_value = 0 or 1).

| Column | Type | Notes |
|---|---|---|
| userId | UUID | FK → user.userId |
| rightCode | VARCHAR(10) | FK → rights.rightCode |
| right_value | INT | 0 = denied, 1 = granted |

**Composite primary key:** (userId, rightCode)

---

## Foreign key relationships

```
employee.empno     ←── jobHistory.empNo
job.jobCode        ←── jobHistory.jobCode
department.deptCode ←── jobHistory.deptCode
Module.moduleCode  ←── rights.moduleCode
Module.moduleCode  ←── user_module.moduleCode
user.userId        ←── user_module.userId
user.userId        ←── UserModule_Rights.userId
rights.rightCode   ←── UserModule_Rights.rightCode
```

---

## SQL views created

| View name | Description |
|---|---|
| `employee_current_job` | Latest active job per employee joined with job + dept info |
| `headcount_by_dept` | Active employee count per department |
| `salary_summary_by_job` | Min / max / avg salary per job title |

---

## RLS policy summary

| Table | RLS enabled | Policies |
|---|---|---|
| employee | Yes | select, insert, update-edit, update-status |
| jobHistory | Yes | select, insert, update-edit, update-status |
| job | Yes | select, insert, update-edit, update-status |
| department | Yes | select, insert, update-edit, update-status |
| user | Yes | select, update-activate |
| UserModule_Rights | Yes | update (no SUPERADMIN edit) |
