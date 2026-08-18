import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";
import { resetFleetMemory } from "./api/fleetApi";

describe("Fusion fleet console", () => {
  it("loads terminals and keeps a selection after the location filter changes", async () => {
    resetFleetMemory();
    const user = userEvent.setup();
    render(<App />);

    const downtownRow = await screen.findByRole("checkbox", { name: "Select POS-DT-01" });
    await user.click(downtownRow);
    expect(downtownRow).toBeChecked();

    await user.selectOptions(screen.getByLabelText("Location"), "airport");
    expect(screen.queryByRole("checkbox", { name: "Select POS-DT-01" })).not.toBeInTheDocument();
    expect(screen.getByText(/1 kept/)).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Location"), "all");
    expect(screen.getByRole("checkbox", { name: "Select POS-DT-01" })).toBeChecked();
  });

  it("queues a patch from the detail panel", async () => {
    resetFleetMemory();
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByText("POS-DT-02"));
    await user.click(screen.getByRole("button", { name: "Queue patch" }));
    expect(await screen.findByText(/POS-DT-02 was queued/)).toBeInTheDocument();
  });
});
