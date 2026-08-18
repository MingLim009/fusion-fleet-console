import { describe, expect, it } from "vitest";
import { sortTerminals } from "./sort";
import { seedSnapshot } from "../data/seed";

describe("sortTerminals", () => {
  it("ranks overdue terminals ahead of current ones", () => {
    const sorted = sortTerminals(seedSnapshot.terminals, "status", "asc");
    expect(sorted[0].patchStatus).toBe("overdue");
    expect(sorted[sorted.length - 1].patchStatus).toBe("current");
  });

  it("sorts hostnames alphabetically", () => {
    const sorted = sortTerminals(seedSnapshot.terminals, "hostname", "asc");
    const names = sorted.map((terminal) => terminal.hostname);
    expect(names).toEqual([...names].sort((left, right) => left.localeCompare(right)));
  });
});
