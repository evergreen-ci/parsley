import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import FilterLogicToggle from ".";

describe("filter logic toggle", () => {
  it("should update the URL correctly", async () => {
    const { history } = render(<FilterLogicToggle />);

    const filterLogicToggle = screen.getByDataCy("filter-logic-toggle");
    expect(filterLogicToggle).toHaveAttribute("aria-checked", "false");

    await userEvent.click(filterLogicToggle);

    expect(filterLogicToggle).toHaveAttribute("aria-checked", "true");
    expect(history.location.search).toBe("?filterLogic=or");

    await userEvent.click(filterLogicToggle);

    expect(filterLogicToggle).toHaveAttribute("aria-checked", "false");
    expect(history.location.search).toBe("?filterLogic=and");
  });
});
