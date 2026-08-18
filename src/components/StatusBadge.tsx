import type { PatchStatus } from "../types";

const LABELS: Record<PatchStatus, string> = {
  current: "Current",
  due: "Due",
  overdue: "Overdue",
  offline: "Offline",
};

export function StatusBadge({ status }: { status: PatchStatus }) {
  return <span className={`status-badge status-${status}`}>{LABELS[status]}</span>;
}
