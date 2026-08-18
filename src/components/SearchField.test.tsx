import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchField } from "./SearchField";

describe("SearchField", () => {
  it("notifies the parent when the query changes", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<SearchField value="" onChange={onChange} />);
    await user.type(screen.getByLabelText("Search terminals"), "KDS");
    expect(onChange).toHaveBeenCalled();
  });
});
