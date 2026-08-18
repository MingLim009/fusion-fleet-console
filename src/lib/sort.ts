import type { PatchStatus, Terminal } from "../types";

const STATUS_RANK: Record<PatchStatus, number> = {
  overdue: 0,
  offline: 1,
  due: 2,
  current: 3,
};

export type SortKey = "hostname" | "status" | "lastPatchedAt";

export function sortTerminals(
  terminals: Terminal[],
  key: SortKey,
  direction: "asc" | "desc",
): Terminal[] {
  const copy = [...terminals];
  copy.sort((left, right) => compareTerminals(left, right, key) * (direction === "asc" ? 1 : -1));
  return copy;
}

function compareTerminals(left: Terminal, right: Terminal, key: SortKey): number {
  if (key === "hostname") {
    return left.hostname.localeCompare(right.hostname);
  }
  if (key === "status") {
    return STATUS_RANK[left.patchStatus] - STATUS_RANK[right.patchStatus];
  }
  return left.lastPatchedAt.localeCompare(right.lastPatchedAt);
}
