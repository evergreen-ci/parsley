import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import FileSelector from ".";

describe("file selector", () => {
  it("clicking the 'Select from files' button should open the file dialog", async () => {
    const open = jest.fn();
    render(<FileSelector open={open} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Select from files" }));
    expect(open).toHaveBeenCalledTimes(1);
  });
});
