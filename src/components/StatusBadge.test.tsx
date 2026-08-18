import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders a text label for overdue terminals", () => {
    render(<StatusBadge status="overdue" />);
    expect(screen.getByText("Overdue")).toBeInTheDocument();
  });
});
