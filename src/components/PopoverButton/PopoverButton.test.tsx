import { fireEvent, render, screen, waitFor } from "test_utils";
import PopoverButton from ".";

describe("popoverButton", () => {
  it("opens a popover when clicked", async () => {
    render(
      <PopoverButton buttonText="Open Popover">Some content</PopoverButton>
    );
    fireEvent.click(screen.getByText("Open Popover"));
    await waitFor(() => {
      expect(screen.getByText("Some content")).toBeVisible();
    });
  });
  it("calls the passed in event handler when the button is clicked", () => {
    const onClick = jest.fn();
    render(
      <PopoverButton buttonText="Open Popover" onClick={onClick}>
        Some content
      </PopoverButton>
    );
    fireEvent.click(screen.getByText("Open Popover"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
