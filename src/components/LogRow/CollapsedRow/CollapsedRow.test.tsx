import { renderWithRouterMatch, screen } from "test_utils";
import CollapsedRow from ".";

const listRowProps = {
  key: "collapsed-row",
  columnIndex: 0,
  index: 0,
  isScrolling: false,
  isVisible: true,
  parent: {} as any,
  style: {},
};

describe("collapsedRow", () => {
  it("renders a collapsed log line", () => {
    renderWithRouterMatch(<CollapsedRow {...listRowProps} numCollapsed={10} />);
    expect(screen.getByText("10 lines skipped")).toBeInTheDocument();
  });

  // TODO EVG-17538: test expanding rows
});
