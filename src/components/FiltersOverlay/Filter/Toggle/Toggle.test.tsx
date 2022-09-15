import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import Toggle from ".";

describe("toggle", () => {
  it("properly renders labels", () => {
    const toggleFunc = jest.fn();
    render(
      <Toggle
        data-cy="toggle"
        leftText="Left"
        onChange={toggleFunc}
        rightText="Right"
        value
      />
    );
    expect(screen.getByText("Left")).toBeInTheDocument();
    expect(screen.getByText("Right")).toBeInTheDocument();
  });

  it("calls the on change function with the correct parameters", async () => {
    const toggleFunc = jest.fn();
    render(
      <Toggle
        data-cy="toggle"
        leftText="Left"
        onChange={toggleFunc}
        rightText="Right"
        value
      />
    );
    const toggleButton = screen.getByRole("button", {
      name: "Right",
    });
    userEvent.click(toggleButton);
    await waitFor(() => {
      expect(toggleFunc).toHaveBeenCalledTimes(1);
    });
    expect(toggleFunc).toHaveBeenCalledWith(false);
  });
});
