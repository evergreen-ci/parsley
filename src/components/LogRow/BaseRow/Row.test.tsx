import { renderWithRouterMatch, screen, userEvent } from "test_utils";
import Row from ".";

describe("row", () => {
  it("renders a log line", () => {
    renderWithRouterMatch(<Row {...rowProps}>{testLog}</Row>);
    expect(screen.getByText(testLog)).toBeVisible();
  });

  it("clicking log line link updates the url and selects it", async () => {
    const scrollToLine = jest.fn();
    const { history } = renderWithRouterMatch(
      <Row {...rowProps} scrollToLine={scrollToLine}>
        {testLog}
      </Row>
    );
    await userEvent.click(screen.getByDataCy("log-link-0"));
    expect(history.location.search).toBe("?selectedLine=0");
    expect(scrollToLine).toHaveBeenCalledWith(0);
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
});

const testLog = "Test Log";

const rowProps = {
  key: testLog,
  columnIndex: 0,
  index: 0,
  isScrolling: false,
  isVisible: true,
  lineNumber: 0,
  parent: {} as any,
  scrollToLine: jest.fn(),
  style: {},
  wrap: false,
};
