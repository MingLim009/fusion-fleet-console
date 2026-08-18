import { useMemo, useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { DetailPanel } from "./components/DetailPanel";
import { LocationFilter } from "./components/LocationFilter";
import { SearchField } from "./components/SearchField";
import { StatusBanner } from "./components/StatusBanner";
import { TerminalTable } from "./components/TerminalTable";
import { useFleet } from "./hooks/useFleet";
import { retainVisibleSelection, toggleSelection } from "./lib/selection";
import { seedSnapshot } from "./data/seed";
import type { LocationId } from "./types";

export default function App() {
  const [locationId, setLocationId] = useState<LocationId | "all">("all");
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("Load the fleet to review exposed POS terminals.");

  const fleet = useFleet(locationId, query);
  const locations = fleet.snapshot?.locations ?? seedSnapshot.locations;

  const selectedInView = useMemo(
    () => retainVisibleSelection(selectedIds, fleet.visible),
    [selectedIds, fleet.visible],
  );

  const activeTerminal =
    fleet.visible.find((terminal) => terminal.id === activeId) ?? null;

  async function handlePatch(terminalId: string): Promise<void> {
    setBusy(true);
    try {
      const updated = await fleet.applyPatch(terminalId);
      setNotice(`${updated.hostname} was queued. Status is now ${updated.patchStatus}.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Patch request failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-shell">
      <AppHeader onRefresh={fleet.refresh} loading={fleet.loading} />
      <StatusBanner
        message={
          fleet.error ??
          (fleet.loading ? "Loading terminal inventory…" : notice)
        }
      />
      <section className="toolbar" aria-label="Fleet filters">
        <LocationFilter
          locations={locations}
          value={locationId}
          onChange={setLocationId}
        />
        <SearchField value={query} onChange={setQuery} />
        <p className="selection-count">
          {selectedInView.size} selected in view / {selectedIds.size} kept
        </p>
      </section>
      <div className="workspace">
        <TerminalTable
          terminals={fleet.visible}
          locations={locations}
          selectedIds={selectedIds}
          activeId={activeId}
          sortKey={fleet.sortKey}
          sortDirection={fleet.sortDirection}
          onToggle={(id) => setSelectedIds((current) => toggleSelection(current, id))}
          onActivate={setActiveId}
          onSort={fleet.changeSort}
        />
        <DetailPanel terminal={activeTerminal} busy={busy} onPatch={handlePatch} />
      </div>
    </div>
  );
}
