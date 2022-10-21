import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import ExpandableRowsToggle from ".";

describe("expandable rows toggle", () => {
  it("should update the URL correctly", async () => {
    const { history } = render(<ExpandableRowsToggle />);

    const expandableRowsToggle = screen.getByDataCy("expandable-rows-toggle");
    expect(expandableRowsToggle).toHaveAttribute("aria-checked", "true");

    await userEvent.click(expandableRowsToggle);

    expect(expandableRowsToggle).toHaveAttribute("aria-checked", "false");
    expect(history.location.search).toBe("?expandable=false");
  });
});
