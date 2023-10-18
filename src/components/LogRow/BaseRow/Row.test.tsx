import { MultiLineSelectContextProvider } from "context/MultiLineSelectContext";
import {
  RenderWithRouterMatchOptions,
  renderWithRouterMatch,
  screen,
  userEvent,
} from "test_utils";
import Row from ".";

const renderRow = (
  props: React.ComponentProps<typeof Row>,
  routerOptions: RenderWithRouterMatchOptions
) =>
  renderWithRouterMatch(<Row {...props} />, {
    ...routerOptions,
    wrapper: ({ children }: { children: React.ReactElement }) => (
      <MultiLineSelectContextProvider>
        {children}
      </MultiLineSelectContextProvider>
    ),
  });

describe("row", () => {
  it("renders a log line", () => {
    renderRow({ ...rowProps, children: testLog, "data-cy": "test" }, {});
    expect(screen.getByText(testLog)).toBeVisible();
    expect(screen.getByDataCy("test")).toBeVisible();
  });

  it("properly escapes a log line with tags and renders its contents", () => {
    const lineContent = "Test line with a <nil> value";
    renderRow({ ...rowProps, children: lineContent }, {});
    expect(screen.getByText(lineContent)).toBeVisible();
  });

  it("clicking log line link updates the url and and scrolls to the line", async () => {
    const user = userEvent.setup();
    const scrollToLine = jest.fn();
    const { router } = renderRow(
      {
        ...rowProps,
        children: testLog,
        lineIndex: 7,
        lineNumber: 54,
        scrollToLine,
      },
      {}
    );
    await user.click(screen.getByDataCy("log-link-54"));
    expect(router.state.location.search).toBe("?shareLine=54");
    expect(scrollToLine).toHaveBeenCalledWith(7);
  });

  it("clicking on a share line's link icon updates the URL correctly", async () => {
    const user = userEvent.setup();
    const { router } = renderRow(
      { ...rowProps, children: testLog },
      { route: "?shareLine=0" }
    );

    await user.click(screen.getByDataCy("log-link-0"));
    expect(router.state.location.search).toBe("");
  });

  it("double clicking a log line adds it to the bookmarks", async () => {
    const user = userEvent.setup();
    const { router } = renderRow({ ...rowProps, children: testLog }, {});
    await user.dblClick(screen.getByText(testLog));
    expect(router.state.location.search).toBe("?bookmarks=0");
  });

  it("double clicking a bookmarked log line removes it from the bookmarks", async () => {
    const user = userEvent.setup();
    const { router } = renderRow(
      { ...rowProps, children: testLog },
      { route: "?bookmarks=0" }
    );

    await user.dblClick(screen.getByText(testLog));
    expect(router.state.location.search).toBe("");
  });

  it("a log line can be shared and bookmarked at the same time", async () => {
    const user = userEvent.setup();
    const { router } = renderRow({ ...rowProps, children: testLog }, {});

    await user.click(screen.getByDataCy("log-link-0"));
    await user.dblClick(screen.getByText(testLog));
    expect(router.state.location.search).toBe("?bookmarks=0&shareLine=0");
  });

  it("should not copy line numbers to clipboard", async () => {
    const user = userEvent.setup({ writeToClipboard: true });
    renderRow({ ...rowProps, children: testLog }, {});

    expect(screen.getByText(/.+/).textContent).toBe("Test Log");
    // select all of the text
    await user.tripleClick(screen.getByText(/.+/));
    const dataTransfer = await user.copy();
    expect(dataTransfer?.getData("text")).toBe("Test Log");
  });

  describe("search / highlights", () => {
    it("should highlight matching search text if it is within range", () => {
      const regexp = /Test/i;
      renderRow(
        {
          ...rowProps,
          children: testLog,
          range: {
            lowerRange: 0,
            upperRange: 10,
          },
          searchTerm: regexp,
        },
        {}
      );

      expect(screen.getByDataCy("highlight")).toHaveTextContent("Test");
    });
    it("should not highlight matching search text if it is outside of range", () => {
      const regexp = /Test/i;
      renderRow(
        {
          ...rowProps,
          children: testLog,
          range: {
            lowerRange: 1,
            upperRange: 2,
          },
          searchTerm: regexp,
        },
        {}
      );

      expect(screen.queryByDataCy("highlight")).not.toBeInTheDocument();
    });
    it("highlighted terms should highlight the matching text", () => {
      const regexp = /Test/i;
      renderRow(
        {
          ...rowProps,
          children: testLog,
          highlightRegex: regexp,
        },
        {}
      );

      expect(screen.getByDataCy("highlight")).toHaveTextContent("Test");
    });
  });
});

const testLog = "Test Log";

const rowProps = {
  columnIndex: 0,
  key: testLog,
  lineIndex: 0,

  lineNumber: 0,
  prettyPrint: false,
  range: {
    lowerRange: 0,
    upperRange: undefined,
  },
  scrollToLine: jest.fn(),
  wrap: false,
};
