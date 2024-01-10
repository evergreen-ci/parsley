import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  within,
} from "test_utils";
import ExpandedNavGroup from ".";

describe("expanded lines", () => {
  it("shows a message when no lines have been expanded", () => {
    render(<ExpandedNavGroup {...props} />);
    expect(
      screen.getByDataCy("expanded-lines-default-message"),
    ).toBeInTheDocument();
  });

  it("expanded lines should properly display based on props", () => {
    render(
      <ExpandedNavGroup
        {...props}
        expandedLines={[
          [0, 2],
          [5, 6],
        ]}
      />,
    );
    expect(screen.getByText("Row 0 to 2")).toBeInTheDocument();
    expect(screen.getByText("Row 5 to 6")).toBeInTheDocument();
  });

  it("shows the number of expanded lines in the header", () => {
    render(
      <ExpandedNavGroup
        {...props}
        expandedLines={[
          [0, 2],
          [5, 6],
          [9, 10],
          [20, 22],
        ]}
      />,
    );
    const navGroupHeader = screen.getByDataCy(
      "expanded-lines-nav-group-header",
    );
    expect(within(navGroupHeader).getByText("4")).toBeInTheDocument();
  });

  it("deleting an expanded line should call collapseLines", async () => {
    const user = userEvent.setup();
    const collapseLines = jest.fn();
    render(
      <ExpandedNavGroup
        {...props}
        collapseLines={collapseLines}
        expandedLines={[[0, 2]]}
      />,
    );
    await user.click(screen.getByLabelText("Delete range"));
    expect(collapseLines).toHaveBeenCalledTimes(1);
    expect(collapseLines).toHaveBeenCalledWith(0);
  });
});

const props = {
  collapseLines: jest.fn(),
  expandedLines: [],
};
