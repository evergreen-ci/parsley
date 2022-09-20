import { render, screen, userEvent } from "test_utils";
import Filter from ".";

describe("filters", () => {
  it("should display the name of the filter", () => {
    const deleteFilter = jest.fn();
    render(<Filter deleteFilter={deleteFilter} filterText="myFilter" />);
    expect(screen.getByText("myFilter")).toBeInTheDocument();
  });

  it("calls deleteFilter with correct parameters", async () => {
    const deleteFilter = jest.fn();
    render(<Filter deleteFilter={deleteFilter} filterText="myFilter" />);

    await userEvent.click(screen.getByLabelText("Delete filter button"));

    expect(deleteFilter).toHaveBeenCalledTimes(1);
    expect(deleteFilter).toHaveBeenCalledWith("myFilter");
  });

  it("should toggle visibility icons when clicked", async () => {
    const deleteFilter = jest.fn();
    render(<Filter deleteFilter={deleteFilter} filterText="myFilter" />);

    expect(screen.getByLabelText("Visibility Icon")).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText("Visibility filter button"));
    expect(screen.getByLabelText("Closed Eye Icon")).toBeInTheDocument();
  });

  it("should be able to interact with Case Sensitivity segmented control", async () => {
    const deleteFilter = jest.fn();
    render(<Filter deleteFilter={deleteFilter} filterText="myFilter" />);

    const insensitiveOption = screen.getByRole("tab", {
      name: "Insensitive",
    });
    const sensitiveOption = screen.getByRole("tab", {
      name: "Sensitive",
    });

    expect(insensitiveOption).toHaveAttribute("aria-selected", "true");
    expect(sensitiveOption).toHaveAttribute("aria-selected", "false");

    await userEvent.click(sensitiveOption);

    expect(insensitiveOption).toHaveAttribute("aria-selected", "false");
    expect(sensitiveOption).toHaveAttribute("aria-selected", "true");
  });

  it("should be able to interact with Match Type segmented control", async () => {
    const deleteFilter = jest.fn();
    render(<Filter deleteFilter={deleteFilter} filterText="myFilter" />);

    const matchOption = screen.getByRole("tab", {
      name: "Match",
    });
    const inverseOption = screen.getByRole("tab", {
      name: "Inverse",
    });

    expect(matchOption).toHaveAttribute("aria-selected", "true");
    expect(inverseOption).toHaveAttribute("aria-selected", "false");

    await userEvent.click(inverseOption);

    expect(matchOption).toHaveAttribute("aria-selected", "false");
    expect(inverseOption).toHaveAttribute("aria-selected", "true");
  });
});
