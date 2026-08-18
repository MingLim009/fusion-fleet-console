import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LocationFilter } from "./LocationFilter";
import { seedSnapshot } from "../data/seed";

describe("LocationFilter", () => {
  it("exposes a labeled location control", () => {
    render(
      <LocationFilter
        locations={seedSnapshot.locations}
        value="all"
        onChange={() => undefined}
      />,
    );
    expect(screen.getByLabelText("Location")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Downtown" })).toBeInTheDocument();
  });
});
