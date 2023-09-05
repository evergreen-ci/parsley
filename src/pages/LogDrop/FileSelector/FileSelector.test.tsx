import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import FileSelector from ".";

describe("file selector", () => {
  it("clicking the 'Select from files' button should open the file dialog", async () => {
    const user = userEvent.setup();
    const open = jest.fn();
    render(<FileSelector getInputProps={jest.fn()} open={open} />);
    await user.click(screen.getByRole("button", { name: "Select from files" }));
    expect(open).toHaveBeenCalledTimes(1);
  });
});
