import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DetailPanel } from "./DetailPanel";
import { seedSnapshot } from "../data/seed";

describe("DetailPanel", () => {
  it("disables patching for offline terminals", () => {
    const offline = seedSnapshot.terminals.find((terminal) => terminal.id === "pos-ap-01");
    if (!offline) {
      throw new Error("missing seed terminal");
    }
    render(<DetailPanel terminal={offline} busy={false} onPatch={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Queue patch" })).toBeDisabled();
  });
});
