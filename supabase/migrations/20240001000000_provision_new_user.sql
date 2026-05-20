-- PR-04: provision_new_user() trigger
-- Fires on auth.users INSERT
-- Creates USER/INACTIVE row in app_user
-- Inserts 5 module rows + 17 rights rows (VIEW only = 1, all others = 0)

CREATE OR REPLACE FUNCTION provision_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := gen_random_uuid();
  v_module   RECORD;
BEGIN
  -- 1. Create app_user row (INACTIVE by default, USER type)
  INSERT INTO app_user (
    "userId",
    auth_id,
    username,
    user_type,
    record_status,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    'USER',
    'INACTIVE',
    NOW(),
    NOW()
  );

  -- 2. Insert 5 module access rows + 17 rights rows per module
  --    Modules: EMPLOYEE, JOB, DEPARTMENT, PAYROLL, REPORTS
  --    Rights:  VIEW=1, all others (CREATE, UPDATE, DELETE, EXPORT, APPROVE, PRINT)=0

  FOR v_module IN
    SELECT unnest(ARRAY[
      'EMPLOYEE',
      'JOB',
      'DEPARTMENT',
      'PAYROLL',
      'REPORTS'
    ]) AS module_name
  LOOP
    INSERT INTO user_module_access (
      "userId",
      module,
      has_access,
      created_at,
      updated_at
    ) VALUES (
      v_user_id,
      v_module.module_name,
      FALSE,
      NOW(),
      NOW()
    );

    INSERT INTO user_module_rights (
      "userId",
      module,
      can_view,
      can_create,
      can_update,
      can_delete,
      can_export,
      can_approve,
      can_print,
      created_at,
      updated_at
    ) VALUES (
      v_user_id,
      v_module.module_name,
      TRUE,   -- VIEW = 1
      FALSE,  -- CREATE = 0
      FALSE,  -- UPDATE = 0
      FALSE,  -- DELETE = 0
      FALSE,  -- EXPORT = 0
      FALSE,  -- APPROVE = 0
      FALSE,  -- PRINT = 0
      NOW(),
      NOW()
    );
  END LOOP;

  RETURN NEW;
END;
$$;

-- Drop trigger if it exists, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION provision_new_user();