import { formatDate } from "../lib/format";
import { StatusBadge } from "./StatusBadge";
import type { SortKey } from "../lib/sort";
import type { Location, Terminal } from "../types";

type TerminalTableProps = {
  terminals: Terminal[];
  locations: Location[];
  selectedIds: ReadonlySet<string>;
  activeId: string | null;
  sortKey: SortKey;
  sortDirection: "asc" | "desc";
  onToggle: (terminalId: string) => void;
  onActivate: (terminalId: string) => void;
  onSort: (key: SortKey) => void;
};

export function TerminalTable({
  terminals,
  locations,
  selectedIds,
  activeId,
  sortKey,
  sortDirection,
  onToggle,
  onActivate,
  onSort,
}: TerminalTableProps) {
  const locationName = new Map(locations.map((location) => [location.id, location.name]));

  return (
    <div className="table-wrap">
      <table>
        <caption className="sr-only">POS terminals and patch status</caption>
        <thead>
          <tr>
            <th scope="col">Select</th>
            <SortHeader
              label="Hostname"
              column="hostname"
              active={sortKey}
              direction={sortDirection}
              onSort={onSort}
            />
            <th scope="col">Location</th>
            <SortHeader
              label="Status"
              column="status"
              active={sortKey}
              direction={sortDirection}
              onSort={onSort}
            />
            <SortHeader
              label="Last patched"
              column="lastPatchedAt"
              active={sortKey}
              direction={sortDirection}
              onSort={onSort}
            />
          </tr>
        </thead>
        <tbody>
          {terminals.length === 0 ? (
            <tr>
              <td colSpan={5}>No terminals match the current filters.</td>
            </tr>
          ) : (
            terminals.map((terminal) => {
              const selected = selectedIds.has(terminal.id);
              return (
                <tr
                  key={terminal.id}
                  className={activeId === terminal.id ? "is-active" : undefined}
                  onClick={() => onActivate(terminal.id)}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selected}
                      aria-label={`Select ${terminal.hostname}`}
                      onChange={() => onToggle(terminal.id)}
                      onClick={(event) => event.stopPropagation()}
                    />
                  </td>
                  <th scope="row">{terminal.hostname}</th>
                  <td>{locationName.get(terminal.locationId)}</td>
                  <td>
                    <StatusBadge status={terminal.patchStatus} />
                  </td>
                  <td>{formatDate(terminal.lastPatchedAt)}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

type SortHeaderProps = {
  label: string;
  column: SortKey;
  active: SortKey;
  direction: "asc" | "desc";
  onSort: (key: SortKey) => void;
};

function SortHeader({ label, column, active, direction, onSort }: SortHeaderProps) {
  const pressed = active === column;
  return (
    <th scope="col">
      <button
        type="button"
        className="sort-button"
        aria-pressed={pressed}
        onClick={() => onSort(column)}
      >
        {label}
        {pressed ? (direction === "asc" ? " ↑" : " ↓") : ""}
      </button>
    </th>
  );
}
