import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import WrapToggle from ".";

describe("wrap toggle", () => {
  it("should update the URL correctly", async () => {
    const { history } = render(<WrapToggle />);

    const wrapToggle = screen.getByDataCy("wrap-toggle");
    expect(wrapToggle).toHaveAttribute("aria-checked", "false");

    await userEvent.click(wrapToggle);

    expect(wrapToggle).toHaveAttribute("aria-checked", "true");
    expect(history.location.search).toBe("?wrap=true");
  });
});
