import { renderWithRouterMatch, screen, userEvent, waitFor } from "test_utils";
import Row from ".";

describe("row", () => {
  it("renders a log line", () => {
    renderWithRouterMatch(
      <Row
        key={testLog}
        columnIndex={0}
        index={0}
        isScrolling={false}
        isVisible
        parent={{} as any}
        style={{}}
        wrap={false}
      >
        {testLog}
      </Row>
    );
    expect(screen.getByText(testLog)).toBeVisible();
  });
  it("clicking log line link updates the url and selects it", async () => {
    const { history } = renderWithRouterMatch(
      <Row
        key={testLog}
        columnIndex={0}
        index={0}
        isScrolling={false}
        isVisible
        parent={{} as any}
        style={{}}
        wrap={false}
      >
        {testLog}
      </Row>
    );
    userEvent.click(screen.getByDataCy("log-link-0"));
    await waitFor(() => {
      expect(history.location.search).toBe("?selectedLine=0");
    });
  });
  it("clicking on a selected log line link unselects it", async () => {
    const { history } = renderWithRouterMatch(
      <Row
        key={testLog}
        columnIndex={0}
        index={0}
        isScrolling={false}
        isVisible
        parent={{} as any}
        style={{}}
        wrap={false}
      >
        {testLog}
      </Row>,
      {
        route: "?selectedLine=0",
      }
    );
    userEvent.click(screen.getByDataCy("log-link-0"));
    await waitFor(() => {
      expect(history.location.search).toBe("");
    });
  });
  it("double clicking a log line adds it to the bookmarks", async () => {
    const { history } = renderWithRouterMatch(
      <Row
        key={testLog}
        columnIndex={0}
        index={0}
        isScrolling={false}
        isVisible
        parent={{} as any}
        style={{}}
        wrap={false}
      >
        {testLog}
      </Row>
    );
    userEvent.dblClick(screen.getByText(testLog));
    await waitFor(() => {
      expect(history.location.search).toBe("?bookmarks=0");
    });
  });
  it("double clicking a bookmarked log line removes it from the bookmarks", async () => {
    const { history } = renderWithRouterMatch(
      <Row
        key={testLog}
        columnIndex={0}
        index={0}
        isScrolling={false}
        isVisible
        parent={{} as any}
        style={{}}
        wrap={false}
      >
        {testLog}
      </Row>,
      {
        route: "?bookmarks=0",
      }
    );
    userEvent.dblClick(screen.getByText(testLog));
    await waitFor(() => {
      expect(history.location.search).toBe("");
    });
  });
  it("a log line can be selected and bookmarked at the same time", async () => {
    const { history } = renderWithRouterMatch(
      <Row
        key={testLog}
        columnIndex={0}
        index={0}
        isScrolling={false}
        isVisible
        parent={{} as any}
        style={{}}
        wrap={false}
      >
        {testLog}
      </Row>
    );
    userEvent.click(screen.getByDataCy("log-link-0"));
    await waitFor(() => {
      expect(history.location.search).toBe("?selectedLine=0");
    });
    userEvent.dblClick(screen.getByText(testLog));
    await waitFor(() => {
      expect(history.location.search).toBe("?bookmarks=0&selectedLine=0");
    });
  });
});

const testLog = "Test Log";
