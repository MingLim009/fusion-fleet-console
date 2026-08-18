import { describe, expect, it } from "vitest";
import { filterTerminals, retainVisibleSelection, toggleSelection } from "./selection";
import { seedSnapshot } from "../data/seed";

describe("filterTerminals", () => {
  it("limits results to one location", () => {
    const result = filterTerminals(seedSnapshot.terminals, "airport", "");
    expect(result.every((terminal) => terminal.locationId === "airport")).toBe(true);
    expect(result).toHaveLength(3);
  });

  it("matches hostname search without regard to case", () => {
    const result = filterTerminals(seedSnapshot.terminals, "all", "kiosk");
    expect(result.map((terminal) => terminal.id)).toEqual(["pos-ap-03"]);
  });
});

describe("selection helpers", () => {
  it("adds and removes a terminal id", () => {
    const added = toggleSelection(new Set(), "pos-dt-01");
    expect(added.has("pos-dt-01")).toBe(true);
    const removed = toggleSelection(added, "pos-dt-01");
    expect(removed.has("pos-dt-01")).toBe(false);
  });

  it("keeps selected ids that remain visible after filtering", () => {
    const selected = new Set(["pos-dt-01", "pos-ap-01"]);
    const visible = filterTerminals(seedSnapshot.terminals, "downtown", "");
    const kept = retainVisibleSelection(selected, visible);
    expect([...kept]).toEqual(["pos-dt-01"]);
  });
});
