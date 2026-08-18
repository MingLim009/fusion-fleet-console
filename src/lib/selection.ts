import type { LocationId, Terminal } from "../types";

export function filterTerminals(
  terminals: Terminal[],
  locationId: LocationId | "all",
  query: string,
): Terminal[] {
  const needle = query.trim().toLowerCase();
  return terminals.filter((terminal) => {
    const matchesLocation =
      locationId === "all" || terminal.locationId === locationId;
    const matchesQuery =
      needle.length === 0 ||
      terminal.hostname.toLowerCase().includes(needle) ||
      terminal.windowsSku.toLowerCase().includes(needle);
    return matchesLocation && matchesQuery;
  });
}

export function retainVisibleSelection(
  selectedIds: ReadonlySet<string>,
  visible: Terminal[],
): Set<string> {
  const visibleIds = new Set(visible.map((terminal) => terminal.id));
  return new Set([...selectedIds].filter((id) => visibleIds.has(id)));
}

export function toggleSelection(
  selectedIds: ReadonlySet<string>,
  terminalId: string,
): Set<string> {
  const next = new Set(selectedIds);
  if (next.has(terminalId)) {
    next.delete(terminalId);
  } else {
    next.add(terminalId);
  }
  return next;
}
