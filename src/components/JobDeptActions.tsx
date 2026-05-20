// feat/rights-job-dept — Sprint 2
// Gated action buttons for the Job and Department table components.

import { useRights } from "@/contexts/UserRightsContext";

// ─── Job action buttons ────────────────────────────────────────────────────────

interface JobActionsProps {
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function JobAddButton({ onAdd }: Pick<JobActionsProps, "onAdd">) {
  const { rights } = useRights();
  if (!rights.JOB_ADD) return null;
  return (
    <button
      onClick={onAdd}
      className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
    >
      + Add Job
    </button>
  );
}

export function JobEditButton({ onEdit }: Pick<JobActionsProps, "onEdit">) {
  const { rights } = useRights();
  if (!rights.JOB_EDIT) return null;
  return (
    <button
      onClick={onEdit}
      className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
    >
      Edit
    </button>
  );
}

export function JobDeleteButton({ onDelete }: Pick<JobActionsProps, "onDelete">) {
  const { rights } = useRights();
  if (!rights.JOB_DEL) return null;
  return (
    <button
      onClick={onDelete}
      className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
    >
      Delete
    </button>
  );
}

// ─── Department action buttons ─────────────────────────────────────────────────

interface DeptActionsProps {
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function DeptAddButton({ onAdd }: Pick<DeptActionsProps, "onAdd">) {
  const { rights } = useRights();
  if (!rights.DEPT_ADD) return null;
  return (
    <button
      onClick={onAdd}
      className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
    >
      + Add Department
    </button>
  );
}

export function DeptEditButton({ onEdit }: Pick<DeptActionsProps, "onEdit">) {
  const { rights } = useRights();
  if (!rights.DEPT_EDIT) return null;
  return (
    <button
      onClick={onEdit}
      className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
    >
      Edit
    </button>
  );
}

export function DeptDeleteButton({ onDelete }: Pick<DeptActionsProps, "onDelete">) {
  const { rights } = useRights();
  if (!rights.DEPT_DEL) return null;
  return (
    <button
      onClick={onDelete}
      className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
    >
      Delete
    </button>
  );
}