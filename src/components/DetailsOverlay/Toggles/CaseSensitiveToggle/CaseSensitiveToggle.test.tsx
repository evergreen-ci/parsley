import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import CaseSensitiveToggle from ".";

describe("case sensitivity toggle", () => {
  it("should update the URL correctly", async () => {
    const { history } = render(<CaseSensitiveToggle />);

    const caseSensitiveToggle = screen.getByDataCy("case-sensitive-toggle");
    expect(caseSensitiveToggle).toHaveAttribute("aria-checked", "false");

    userEvent.click(caseSensitiveToggle);
    await waitFor(() => {
      expect(caseSensitiveToggle).toHaveAttribute("aria-checked", "true");
    });
    expect(history.location.search).toBe("?caseSensitive=true");
  });
});
