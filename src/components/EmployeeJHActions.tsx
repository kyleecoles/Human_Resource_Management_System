// feat/rights-employee-jh — Sprint 2
// Drop-in gated action buttons for the Employee and Job History tables.
// Import { GatedButton } from "@/components/GatedButton" for one-liners,
// or use the pre-composed sets below directly in the table components.

import { type ReactNode } from "react";
import { useRights, type RightKey } from "@/contexts/UserRightsContext";

// ─── Primitive: renders children only when the right is granted ───────────────
interface GatedButtonProps {
  right: RightKey;
  children: ReactNode;
}

export function GatedButton({ right, children }: GatedButtonProps) {
  const { rights } = useRights();
  if (!rights[right]) return null;
  return <>{children}</>;
}

// ─── Employee action buttons ───────────────────────────────────────────────────

interface EmployeeActionsProps {
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

/**
 * Place at the top of EmployeeListPage for the Add button,
 * and per-row for Edit / Delete.
 */
export function EmployeeAddButton({ onAdd }: Pick<EmployeeActionsProps, "onAdd">) {
  const { rights } = useRights();
  if (!rights.EMP_ADD) return null;
  return (
    <button
      onClick={onAdd}
      className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
    >
      + Add Employee
    </button>
  );
}

export function EmployeeEditButton({ onEdit }: Pick<EmployeeActionsProps, "onEdit">) {
  const { rights } = useRights();
  if (!rights.EMP_EDIT) return null;
  return (
    <button
      onClick={onEdit}
      className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
    >
      Edit
    </button>
  );
}

export function EmployeeDeleteButton({
  onDelete,
}: Pick<EmployeeActionsProps, "onDelete">) {
  const { rights } = useRights();
  if (!rights.EMP_DEL) return null;
  return (
    <button
      onClick={onDelete}
      className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
    >
      Delete
    </button>
  );
}

// ─── Job History action buttons ────────────────────────────────────────────────

interface JobHistoryActionsProps {
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

/**
 * Place inside EmployeeDetailPage / JobHistoryPanel.
 */
export function JobHistoryAddButton({
  onAdd,
}: Pick<JobHistoryActionsProps, "onAdd">) {
  const { rights } = useRights();
  if (!rights.JH_ADD) return null;
  return (
    <button
      onClick={onAdd}
      className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
    >
      + Add Job History
    </button>
  );
}

export function JobHistoryEditButton({
  onEdit,
}: Pick<JobHistoryActionsProps, "onEdit">) {
  const { rights } = useRights();
  if (!rights.JH_EDIT) return null;
  return (
    <button
      onClick={onEdit}
      className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
    >
      Edit
    </button>
  );
}

export function JobHistoryDeleteButton({
  onDelete,
}: Pick<JobHistoryActionsProps, "onDelete">) {
  const { rights } = useRights();
  if (!rights.JH_DEL) return null;
  return (
    <button
      onClick={onDelete}
      className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
    >
      Delete
    </button>
  );
}