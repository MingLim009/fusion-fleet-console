import { describe, expect, it } from "vitest";
import { formatDate, formatStamp } from "./format";

describe("date formatters", () => {
  it("formats a calendar date", () => {
    expect(formatDate("2026-08-12T04:10:00.000Z")).toMatch(/2026/);
  });

  it("formats a date and time", () => {
    expect(formatStamp("2026-08-12T04:10:00.000Z")).toMatch(/2026/);
  });
});
