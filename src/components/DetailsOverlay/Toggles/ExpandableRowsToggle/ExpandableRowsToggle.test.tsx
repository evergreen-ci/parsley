import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import ExpandableRowsToggle from ".";

describe("expandable rows toggle", () => {
  it("should update the URL correctly", async () => {
    const { history } = render(<ExpandableRowsToggle />);

    const expandableRowsToggle = screen.getByDataCy("expandable-rows-toggle");
    expect(expandableRowsToggle).toHaveAttribute("aria-checked", "false");

    userEvent.click(expandableRowsToggle);
    await waitFor(() => {
      expect(expandableRowsToggle).toHaveAttribute("aria-checked", "true");
    });
    expect(history.location.search).toBe("?expandable=true");
  });
});
