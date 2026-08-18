import { useEffect, useMemo, useState } from "react";
import { fetchFleet, queuePatch } from "../api/fleetApi";
import { filterTerminals } from "../lib/selection";
import { sortTerminals, type SortKey } from "../lib/sort";
import type { FleetSnapshot, LocationId, Terminal } from "../types";

type FleetState = {
  snapshot: FleetSnapshot | null;
  error: string | null;
  loading: boolean;
};

export function useFleet(locationId: LocationId | "all", query: string) {
  const [state, setState] = useState<FleetState>({
    snapshot: null,
    error: null,
    loading: true,
  });
  const [sortKey, setSortKey] = useState<SortKey>("status");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    setState((current) => ({ ...current, loading: true, error: null }));

    fetchFleet(controller.signal)
      .then((snapshot) => {
        if (cancelled) {
          return;
        }
        setState({ snapshot, error: null, loading: false });
      })
      .catch((error: unknown) => {
        if (cancelled || isAbort(error)) {
          return;
        }
        setState({
          snapshot: null,
          error: error instanceof Error ? error.message : "Unable to load fleet.",
          loading: false,
        });
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [requestVersion]);

  const visible = useMemo(() => {
    if (!state.snapshot) {
      return [];
    }
    const filtered = filterTerminals(state.snapshot.terminals, locationId, query);
    return sortTerminals(filtered, sortKey, sortDirection);
  }, [state.snapshot, locationId, query, sortKey, sortDirection]);

  async function applyPatch(terminalId: string): Promise<Terminal> {
    const updated = await queuePatch(terminalId);
    setState((current) => {
      if (!current.snapshot) {
        return current;
      }
      return {
        ...current,
        snapshot: {
          ...current.snapshot,
          fetchedAt: new Date().toISOString(),
          terminals: current.snapshot.terminals.map((terminal) =>
            terminal.id === updated.id ? updated : terminal,
          ),
        },
      };
    });
    return updated;
  }

  function refresh(): void {
    setRequestVersion((value) => value + 1);
  }

  function changeSort(nextKey: SortKey): void {
    if (nextKey === sortKey) {
      setSortDirection((value) => (value === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(nextKey);
    setSortDirection("asc");
  }

  return {
    ...state,
    visible,
    sortKey,
    sortDirection,
    refresh,
    applyPatch,
    changeSort,
  };
}

function isAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}
