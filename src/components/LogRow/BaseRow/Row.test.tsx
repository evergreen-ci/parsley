import { LogContextProvider } from "context/LogContext";
import { renderWithRouterMatch, screen, userEvent } from "test_utils";
import Row from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
);

describe("row", () => {
  it("renders a log line", () => {
    renderWithRouterMatch(<Row {...rowProps}>{testLog}</Row>, { wrapper });
    expect(screen.getByText(testLog)).toBeVisible();
  });

  it("properly escapes a log line with tags and renders its contents", () => {
    const lineContent = "Test line with a <nil> value";
    renderWithRouterMatch(<Row {...rowProps}>{lineContent}</Row>, { wrapper });
    expect(screen.getByText(lineContent)).toBeVisible();
  });

  it("clicking log line link updates the url and and scrolls to the line", async () => {
    const scrollToLine = jest.fn();
    const { history } = renderWithRouterMatch(
      <Row {...rowProps} index={7} lineNumber={54} scrollToLine={scrollToLine}>
        {testLog}
      </Row>,
      { wrapper }
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
        wrapper,
      }
    );
    await userEvent.click(screen.getByDataCy("log-link-0"));
    expect(history.location.search).toBe("");
  });

  it("double clicking a log line adds it to the bookmarks", async () => {
    const { history } = renderWithRouterMatch(
      <Row {...rowProps}>{testLog}</Row>,
      { wrapper }
    );
    await userEvent.dblClick(screen.getByText(testLog));
    expect(history.location.search).toBe("?bookmarks=0");
  });

  it("double clicking a bookmarked log line removes it from the bookmarks", async () => {
    const { history } = renderWithRouterMatch(
      <Row {...rowProps}>{testLog}</Row>,
      {
        route: "?bookmarks=0",
        wrapper,
      }
    );
    await userEvent.dblClick(screen.getByText(testLog));
    expect(history.location.search).toBe("");
  });

  it("a log line can be selected and bookmarked at the same time", async () => {
    const { history } = renderWithRouterMatch(
      <Row {...rowProps}>{testLog}</Row>,
      { wrapper }
    );
    await userEvent.click(screen.getByDataCy("log-link-0"));
    await userEvent.dblClick(screen.getByText(testLog));
    expect(history.location.search).toBe("?bookmarks=0&selectedLine=0");
  });
  describe("search", () => {
    it("a search term highlights the matching text", () => {
      const regexp = /Test/i;
      renderWithRouterMatch(
        <Row {...rowProps} searchTerm={regexp}>
          {testLog}
        </Row>,
        { wrapper }
      );
      expect(screen.getByDataCy("highlight")).toHaveTextContent("Test");
    });

    it("should preserve case sensitivity when applying a search", () => {
      let regexp = /test/i;
      const { rerender } = renderWithRouterMatch(
        <Row {...rowProps} searchTerm={regexp}>
          {testLog}
        </Row>,
        { wrapper }
      );
      expect(screen.getByDataCy("highlight")).toHaveTextContent("Test");
      regexp = /test/;
      rerender(
        <Row {...rowProps} searchTerm={regexp}>
          {testLog}
        </Row>
      );
      expect(screen.queryByDataCy("highlight")).toBeNull();
    });
  });
  describe("highlights", () => {
    it("highlighted terms should highlight the matching text", () => {
      const regexp = /Test/i;
      renderWithRouterMatch(
        <Row {...rowProps} highlights={regexp}>
          {testLog}
        </Row>,
        { wrapper }
      );
      expect(screen.getByDataCy("highlight")).toHaveTextContent("Test");
    });

    it("should highlight every matching term on a line", () => {
      const regexp = /Test|Log/i;
      renderWithRouterMatch(
        <Row {...rowProps} highlights={regexp}>
          {testLog}
        </Row>,
        { wrapper }
      );
      expect(screen.queryAllByDataCy("highlight")).toHaveLength(2);
      screen.getAllByDataCy("highlight").forEach((highlight) => {
        expect(highlight).toHaveTextContent(/Test|Log/i);
      });
    });
    it("should deduplicate highlights and searches on the same string", () => {
      const regexp = /Test/i;
      renderWithRouterMatch(
        <Row {...rowProps} highlights={regexp} searchTerm={regexp}>
          {testLog}
        </Row>,
        { wrapper }
      );
      expect(screen.queryAllByDataCy("highlight")).toHaveLength(1);
      expect(screen.getByDataCy("highlight")).toHaveTextContent("Test");
    });
    it("should show both highlights and searches if they are on the same line", () => {
      const searchRegex = /Test/i;
      const highlightRegex = /Log/i;
      renderWithRouterMatch(
        <Row {...rowProps} highlights={highlightRegex} searchTerm={searchRegex}>
          {testLog}
        </Row>,
        { wrapper }
      );
      expect(screen.queryAllByDataCy("highlight")).toHaveLength(2);
      screen.getAllByDataCy("highlight").forEach((highlight) => {
        expect(highlight).toHaveTextContent(/Test|Log/i);
      });
    });
  });

  describe("pretty print", () => {
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
          wrapper,
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
          wrapper,
        }
      );
      await userEvent.dblClick(screen.getByText(testLog));
      expect(history.location.search).toBe("");
      expect(resetRowHeightAtIndex).toHaveBeenCalledTimes(0);
    });
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
