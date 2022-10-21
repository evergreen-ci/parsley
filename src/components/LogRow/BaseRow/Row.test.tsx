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
  it("a search term highlights the matching text", () => {
    const regexp = /Test/i;
    renderWithRouterMatch(
      <Row {...rowProps} searchTerm={regexp}>
        {testLog}
      </Row>
    );
    expect(screen.getByDataCy("highlight")).toHaveTextContent("Test");
  });
  it("highlighted terms should highlight the matching text", () => {
    const regexp = /Test/i;
    renderWithRouterMatch(
      <Row {...rowProps} highlights={regexp}>
        {testLog}
      </Row>
    );
    expect(screen.getByDataCy("highlight")).toHaveTextContent("Test");
  });
  it("should deduplicate highlights and searches on the same text", () => {
    const regexp = /Test/i;
    renderWithRouterMatch(
      <Row {...rowProps} highlights={regexp} searchTerm={regexp}>
        {testLog}
      </Row>
    );
    expect(screen.queryAllByDataCy("highlight")).toHaveLength(1);
    expect(screen.getByDataCy("highlight")).toHaveTextContent("Test");
  });
});

const testLog = "Test Log";

const rowProps = {
  key: testLog,
  columnIndex: 0,
  index: 0,
  isScrolling: false,
  scrollToLine: jest.fn(),
  isVisible: true,
  lineNumber: 0,
  parent: {} as any,
  style: {},
  wrap: false,
};
