import { fireEvent, render, screen, waitFor } from "test_utils";
import IconWithTooltip from ".";

describe("iconWithTooltip", () => {
  it("renders a tooltip when hovered", async () => {
    render(
      <IconWithTooltip data-cy="Icon" glyph="Warning">
        Some Text
      </IconWithTooltip>
    );
    expect(screen.queryByText("Some Text")).toBeNull();
    fireEvent.mouseEnter(screen.getByDataCy("Icon"));
    await waitFor(() => {
      expect(screen.getByText("Some Text")).toBeVisible();
    });
  });
});
