-- /db/migrations/005_trigger_cascade.sql
-- S2 PR-03: Cascade soft-delete trigger — employee → jobHistory

CREATE OR REPLACE FUNCTION cascade_employee_status()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.record_status IS DISTINCT FROM OLD.record_status THEN
    UPDATE "jobHistory"
    SET record_status = NEW.record_status,
        stamp = 'CASCADE:' || NEW.stamp
    WHERE "empNo" = NEW.empno;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_cascade_employee_status
AFTER UPDATE OF record_status ON employee
FOR EACH ROW
EXECUTE FUNCTION cascade_employee_status();

-- Verification query (run in Supabase after applying):
-- UPDATE employee SET record_status='INACTIVE', stamp='TEST:cascade' WHERE empno='00001';
-- SELECT empNo, record_status FROM "jobHistory" WHERE "empNo"='00001'; -- all should be INACTIVE
-- UPDATE employee SET record_status='ACTIVE', stamp='TEST:restore' WHERE empno='00001';
-- SELECT empNo, record_status FROM "jobHistory" WHERE "empNo"='00001'; -- all should be ACTIVE
