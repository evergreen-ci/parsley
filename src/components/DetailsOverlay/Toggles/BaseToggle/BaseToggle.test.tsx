import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import BaseToggle from ".";

describe("base toggle", () => {
  it("properly renders labels", () => {
    const toggleFunc = jest.fn();
    render(
      <BaseToggle
        data-cy="toggle"
        label="Test Label"
        leftLabel="Left"
        onChange={toggleFunc}
        rightLabel="Right"
        value
      />
    );
    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByText("Left")).toBeInTheDocument();
    expect(screen.getByText("Right")).toBeInTheDocument();
  });

  it("calls the on change function with the correct parameters", async () => {
    const toggleFunc = jest.fn();
    render(
      <BaseToggle
        data-cy="toggle"
        label="test"
        onChange={toggleFunc}
        value={false}
      />
    );
    const toggle = screen.getByDataCy("toggle");

    userEvent.click(toggle);
    await waitFor(() => {
      expect(toggleFunc).toHaveBeenCalledTimes(1);
    });
    // The second parameter is a mouseEvent that can be ignored.
    expect(toggleFunc).toHaveBeenCalledWith(true, expect.anything());
  });
});
