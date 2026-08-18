import { describe, expect, it, beforeEach } from "vitest";
import { fetchFleet, queuePatch, resetFleetMemory } from "./fleetApi";

describe("fleetApi", () => {
  beforeEach(() => {
    resetFleetMemory();
  });

  it("returns seeded terminals", async () => {
    const snapshot = await fetchFleet();
    expect(snapshot.terminals.length).toBeGreaterThan(0);
    expect(snapshot.locations).toHaveLength(3);
  });

  it("refuses to patch an offline terminal", async () => {
    await expect(queuePatch("pos-ap-01")).rejects.toThrow(/offline/);
  });
});
