import { renderWithRouterMatch, screen, userEvent } from "test_utils";
import Row from ".";

describe("row", () => {
  it("renders a log line", () => {
    renderWithRouterMatch(<Row {...rowProps}>{testLog}</Row>);
    expect(screen.getByText(testLog)).toBeVisible();
  });

  it("properly escapes a log line with tags and renders its contents", () => {
    const lineContent = "Test line with a <nil> value";
    renderWithRouterMatch(<Row {...rowProps}>{lineContent}</Row>);
    expect(screen.getByText(lineContent)).toBeVisible();
  });

  it("clicking log line link updates the url and and scrolls to the line", async () => {
    const scrollToLine = jest.fn();
    const { router } = renderWithRouterMatch(
      <Row
        {...rowProps}
        lineIndex={7}
        lineNumber={54}
        scrollToLine={scrollToLine}
      >
        {testLog}
      </Row>
    );
    await userEvent.click(screen.getByDataCy("log-link-54"));
    expect(router.state.location.search).toBe("?shareLine=54");
    expect(scrollToLine).toHaveBeenCalledWith(7);
  });

  it("clicking on a share line's link icon updates the URL correctly", async () => {
    const { router } = renderWithRouterMatch(
      <Row {...rowProps}>{testLog}</Row>,
      {
        route: "?shareLine=0",
      }
    );
    await userEvent.click(screen.getByDataCy("log-link-0"));
    expect(router.state.location.search).toBe("");
  });

  it("double clicking a log line adds it to the bookmarks", async () => {
    const { router } = renderWithRouterMatch(
      <Row {...rowProps}>{testLog}</Row>
    );
    await userEvent.dblClick(screen.getByText(testLog));
    expect(router.state.location.search).toBe("?bookmarks=0");
  });

  it("double clicking a bookmarked log line removes it from the bookmarks", async () => {
    const { router } = renderWithRouterMatch(
      <Row {...rowProps}>{testLog}</Row>,
      {
        route: "?bookmarks=0",
      }
    );
    await userEvent.dblClick(screen.getByText(testLog));
    expect(router.state.location.search).toBe("");
  });

  it("a log line can be shared and bookmarked at the same time", async () => {
    const { router } = renderWithRouterMatch(
      <Row {...rowProps}>{testLog}</Row>
    );
    await userEvent.click(screen.getByDataCy("log-link-0"));
    await userEvent.dblClick(screen.getByText(testLog));
    expect(router.state.location.search).toBe("?bookmarks=0&shareLine=0");
  });

  it("should not copy line numbers to clipboard", async () => {
    const user = userEvent.setup({ writeToClipboard: true });

    renderWithRouterMatch(<Row {...rowProps}>{testLog}</Row>);
    expect(screen.getByText(/.+/).textContent).toBe("Test Log");
    // select all of the text
    await user.tripleClick(screen.getByText(/.+/));
    const dataTransfer = await user.copy();
    expect(dataTransfer?.getData("text")).toBe("Test Log");
  });
  describe("search", () => {
    it("a search term highlights the matching text", () => {
      const regexp = /Test/i;
      renderWithRouterMatch(
        <Row {...rowProps} searchTerm={regexp}>
          {testLog}
        </Row>
      );
      expect(screen.getByDataCy("highlight")).toHaveTextContent("Test");
    });

    it("should preserve case sensitivity when applying a search", () => {
      let regexp = /test/i;
      const { rerender } = renderWithRouterMatch(
        <Row {...rowProps} searchTerm={regexp}>
          {testLog}
        </Row>
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
    it("should highlight matching text if it is within range", () => {
      const regexp = /Test/i;
      renderWithRouterMatch(
        <Row
          {...rowProps}
          range={{
            lowerRange: 0,
            upperRange: 10,
          }}
          searchTerm={regexp}
        >
          {testLog}
        </Row>
      );
      expect(screen.getByDataCy("highlight")).toHaveTextContent("Test");
    });
    it("should not highlight matching text if it is outside of range", () => {
      const regexp = /Test/i;
      renderWithRouterMatch(
        <Row
          {...rowProps}
          range={{
            lowerRange: 1,
            upperRange: 2,
          }}
          searchTerm={regexp}
        >
          {testLog}
        </Row>
      );
      expect(screen.queryByDataCy("highlight")).not.toBeInTheDocument();
    });
  });
  describe("highlights", () => {
    it("highlighted terms should highlight the matching text", () => {
      const regexp = /Test/i;
      renderWithRouterMatch(
        <Row {...rowProps} highlightRegex={regexp}>
          {testLog}
        </Row>
      );
      expect(screen.getByDataCy("highlight")).toHaveTextContent("Test");
    });

    it("should highlight every matching term on a line", () => {
      const regexp = /Test|Log/gi;
      renderWithRouterMatch(
        <Row {...rowProps} highlightRegex={regexp}>
          {testLog}
        </Row>
      );
      expect(screen.queryAllByDataCy("highlight")).toHaveLength(2);
      screen.getAllByDataCy("highlight").forEach((highlight) => {
        expect(highlight).toHaveTextContent(/Test|Log/i);
      });
    });
    it("should deduplicate highlights and searches on the same string", () => {
      const regexp = /Test/i;
      renderWithRouterMatch(
        <Row {...rowProps} highlightRegex={regexp} searchTerm={regexp}>
          {testLog}
        </Row>
      );
      expect(screen.queryAllByDataCy("highlight")).toHaveLength(1);
      expect(screen.getByDataCy("highlight")).toHaveTextContent("Test");
    });
    it("should show both highlights and searches if they are on the same line", () => {
      const searchRegex = /Test/i;
      const highlightRegex = /(Log)/i;
      renderWithRouterMatch(
        <Row
          {...rowProps}
          highlightRegex={highlightRegex}
          searchTerm={searchRegex}
        >
          {testLog}
        </Row>
      );
      expect(screen.queryAllByDataCy("highlight")).toHaveLength(2);
      screen.getAllByDataCy("highlight").forEach((highlight) => {
        expect(highlight).toHaveTextContent(/Test|Log/i);
      });
    });
  });
});

const testLog = "Test Log";

const rowProps = {
  key: testLog,
  columnIndex: 0,
  lineIndex: 0,

  scrollToLine: jest.fn(),
  lineNumber: 0,
  prettyPrint: false,
  wrap: false,
  range: {
    lowerRange: 0,
    upperRange: undefined,
  },
};
