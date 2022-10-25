import { renderWithRouterMatch, screen, userEvent } from "test_utils";
import Row from ".";

describe("row", () => {
  it("renders a log line", () => {
    renderWithRouterMatch(<Row {...rowProps}>{testLog}</Row>);
    expect(screen.getByText(testLog)).toBeVisible();
  });

  it("clicking log line link updates the url and and scrolls to the line", async () => {
    const scrollToLine = jest.fn();
    const { history } = renderWithRouterMatch(
      <Row {...rowProps} index={7} lineNumber={54} scrollToLine={scrollToLine}>
        {testLog}
      </Row>
    );
    await userEvent.click(screen.getByDataCy("log-link-54"));
    expect(history.location.search).toBe("?selectedLine=54");
    expect(scrollToLine).toHaveBeenCalledWith(7);
  });

  it("clicking on a selected log line link unselects it", async () => {
    const { history } = renderWithRouterMatch(
      <Row {...rowProps}>{testLog}</Row>,
      {
        route: "?selectedLine=0",
      }
    );
    await userEvent.click(screen.getByDataCy("log-link-0"));
    expect(history.location.search).toBe("");
  });

  it("double clicking a log line adds it to the bookmarks", async () => {
    const { history } = renderWithRouterMatch(
      <Row {...rowProps}>{testLog}</Row>
    );
    await userEvent.dblClick(screen.getByText(testLog));
    expect(history.location.search).toBe("?bookmarks=0");
  });

  it("double clicking a bookmarked log line removes it from the bookmarks", async () => {
    const { history } = renderWithRouterMatch(
      <Row {...rowProps}>{testLog}</Row>,
      {
        route: "?bookmarks=0",
      }
    );
    await userEvent.dblClick(screen.getByText(testLog));
    expect(history.location.search).toBe("");
  });

  it("a log line can be selected and bookmarked at the same time", async () => {
    const { history } = renderWithRouterMatch(
      <Row {...rowProps}>{testLog}</Row>
    );
    await userEvent.click(screen.getByDataCy("log-link-0"));
    await userEvent.dblClick(screen.getByText(testLog));
    expect(history.location.search).toBe("?bookmarks=0&selectedLine=0");
  });

  it("bookmarking a line when pretty print is enabled should call resetRowHeightAtIndex", async () => {
    const resetRowHeightAtIndex = jest.fn();
    const { history } = renderWithRouterMatch(
      <Row
        {...rowProps}
        prettyPrint
        resetRowHeightAtIndex={resetRowHeightAtIndex}
      >
        {testLog}
      </Row>,
      {
        route: "?bookmarks=0",
      }
    );
    await userEvent.dblClick(screen.getByText(testLog));
    expect(history.location.search).toBe("");
    expect(resetRowHeightAtIndex).toHaveBeenCalledTimes(1);
    expect(resetRowHeightAtIndex).toHaveBeenCalledWith(0);
  });

  it("bookmarking a line when pretty print is not enabled should not call resetRowHeightAtIndex", async () => {
    const resetRowHeightAtIndex = jest.fn();
    const { history } = renderWithRouterMatch(
      <Row
        {...rowProps}
        prettyPrint={false}
        resetRowHeightAtIndex={resetRowHeightAtIndex}
      >
        {testLog}
      </Row>,
      {
        route: "?bookmarks=0",
      }
    );
    await userEvent.dblClick(screen.getByText(testLog));
    expect(history.location.search).toBe("");
    expect(resetRowHeightAtIndex).toHaveBeenCalledTimes(0);
  });
});

const testLog = "Test Log";

const rowProps = {
  key: testLog,
  columnIndex: 0,
  index: 0,
  isVisible: true,
  isScrolling: false,
  parent: {} as any,
  style: {},

  resetRowHeightAtIndex: jest.fn(),
  scrollToLine: jest.fn(),
  lineNumber: 0,
  prettyPrint: false,
  wrap: false,
};
