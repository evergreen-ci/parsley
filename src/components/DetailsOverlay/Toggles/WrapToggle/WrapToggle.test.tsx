import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import WrapToggle from ".";

describe("wrap toggle", () => {
  it("should update the URL correctly", async () => {
    const { history } = render(<WrapToggle />);

    const wrapToggle = screen.getByDataCy("wrap-toggle");
    expect(wrapToggle).toHaveAttribute("aria-checked", "false");

    userEvent.click(wrapToggle);
    await waitFor(() => {
      expect(wrapToggle).toHaveAttribute("aria-checked", "true");
    });
    expect(history.location.search).toBe("?wrap=true");
  });
});
