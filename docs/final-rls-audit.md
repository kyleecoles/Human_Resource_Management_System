# HopeHRS — Final RLS Audit & Hard-Delete Verification

**Project:** HopeHRS Human Resource Management System  
**Engineer:** M3 – Backend / Database Engineer  
**Sprint:** 3 · PR-03  
**Date:** <!-- fill in today's date -->  
**Auditor:** <!-- fill in your name -->  

---

## 1. RLS enabled — table checklist

Run this query in Supabase SQL Editor and paste your screenshot below:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'employee','jobHistory','job','department',
    'user','UserModule_Rights'
  );
```

| Table | RLS Enabled | Confirmed |
|---|---|---|
| employee | TRUE | ☐ |
| jobHistory | TRUE | ☐ |
| job | TRUE | ☐ |
| department | TRUE | ☐ |
| user | TRUE | ☐ |
| UserModule_Rights | TRUE | ☐ |

**Screenshot:** <!-- paste screenshot of query result here -->

---

## 2. Policy inventory

Run this query and paste your screenshot below:

```sql
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
```

| Table | Policy name | Command |
|---|---|---|
| department | dept_select | SELECT |
| department | dept_insert | INSERT |
| department | dept_update_edit | UPDATE |
| department | dept_update_status | UPDATE |
| employee | employee_select | SELECT |
| employee | employee_insert | INSERT |
| employee | employee_update_edit | UPDATE |
| employee | employee_update_status | UPDATE |
| job | job_select | SELECT |
| job | job_insert | INSERT |
| job | job_update_edit | UPDATE |
| job | job_update_status | UPDATE |
| jobHistory | jh_select | SELECT |
| jobHistory | jh_insert | INSERT |
| jobHistory | jh_update_edit | UPDATE |
| jobHistory | jh_update_status | UPDATE |
| user | user_select_admin | SELECT |
| user | user_update_activate | UPDATE |
| UserModule_Rights | umr_no_superadmin_edit | UPDATE |

**Screenshot:** <!-- paste screenshot of policy list here -->

---

## 3. Hard-delete audit

### 3a. SQL files — no DELETE keyword
Run this in your VS Code terminal from the project root:

```bash
grep -r "DELETE FROM" db/ --include="*.sql"
```

Expected output: *(no results / blank)*

**Result:** <!-- paste terminal output here — should be empty -->

### 3b. Frontend source code — no .delete() calls
Run this in your VS Code terminal:

```bash
grep -r "\.delete(" src/ --include="*.ts" --include="*.tsx"
```

Expected output: *(no results / blank)*

**Result:** <!-- paste terminal output here — should be empty -->

### 3c. Soft-delete confirmed
All deletions in this system are performed via:
```sql
UPDATE table_name SET record_status = 'INACTIVE' WHERE ...;
```
No `DELETE` statement exists anywhere in the codebase.

---

## 4. Cascade trigger verification

Run this in Supabase SQL Editor:

```sql
SELECT trigger_name, event_object_table, action_timing, event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

Expected: `trg_cascade_employee_status` listed on `employee` table.

**Screenshot:** <!-- paste screenshot here -->

---

## 5. Database backup confirmation

Go to Supabase Dashboard → Settings → Database → Backups.  
Confirm automated backups are enabled.

**Screenshot:** <!-- paste screenshot of backup status here -->

---

## 6. Sign-off

| Item | Status |
|---|---|
| All 6 tables have RLS enabled | ☐ Confirmed |
| All 19 policies listed in Supabase | ☐ Confirmed |
| Zero DELETE keywords in /db/ SQL files | ☐ Confirmed |
| Zero .delete() calls in /src/ code | ☐ Confirmed |
| Cascade trigger active on employee table | ☐ Confirmed |
| Supabase backup enabled | ☐ Confirmed |

**Engineer:** <!-- your name -->  
**Date completed:** <!-- date -->  
**Confirmation:** I certify that all RLS policies are active in production and no hard deletes exist anywhere in this codebase.
