import { renderWithRouterMatch, screen, userEvent, waitFor } from "test_utils";
import SideBar from ".";

describe("sideBar", () => {
  it("should not add bookmarks if there are no log lines", async () => {
    const { history } = renderWithRouterMatch(
      <SideBar
        maxLineNumber={0}
        processedLogLines={[]}
        scrollToLine={jest.fn()}
      />
    );
    await waitFor(() => {
      expect(history.location.search).toBe("");
    });
  });

  it("should set 0 and last log line as the initial bookmarks", async () => {
    const { history } = renderWithRouterMatch(
      <SideBar
        maxLineNumber={10}
        processedLogLines={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        scrollToLine={jest.fn()}
      />
    );
    await waitFor(() => {
      expect(history.location.search).toBe("?bookmarks=0,10");
    });
  });

  it("should properly display sorted bookmarks and selectedLine", () => {
    renderWithRouterMatch(
      <SideBar
        maxLineNumber={10}
        processedLogLines={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        scrollToLine={jest.fn()}
      />,
      {
        route: "?bookmarks=1,7&selectedLine=5",
      }
    );
    const { children } = screen.getByDataCy("sidebar-log-line-container");
    expect(children).toHaveLength(3);
    expect((children.item(0) as Element).textContent).toContain("1");
    expect((children.item(1) as Element).textContent).toContain("5");
    expect((children.item(1) as Element).children.item(1)).toStrictEqual(
      screen.getByLabelText("Link Icon")
    );
    expect((children.item(2) as Element).textContent).toContain("7");
  });

  it("should be able to clear all bookmarks without removing selected line", async () => {
    const { history } = renderWithRouterMatch(
      <SideBar
        maxLineNumber={10}
        processedLogLines={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        scrollToLine={jest.fn()}
      />,
      {
        route: "?bookmarks=1,3&selectedLine=5",
      }
    );
    await userEvent.click(screen.getByDataCy("clear-bookmarks"));
    expect(history.location.search).toBe("?selectedLine=5");
  });

  it("should call scrollToLine when clicking on a log line (with no collapsed lines)", async () => {
    const scrollToLine = jest.fn();
    renderWithRouterMatch(
      <SideBar
        maxLineNumber={4}
        processedLogLines={[0, 1, 2, 3, 4]}
        scrollToLine={scrollToLine}
      />,
      {
        route: "?bookmarks=1,3",
      }
    );
    await userEvent.click(screen.getByDataCy("sidebar-log-line-3"));
    expect(scrollToLine).toHaveBeenCalledTimes(1);
    expect(scrollToLine).toHaveBeenCalledWith(3);
  });

  it("should call scrollToLine when clicking on a log line (with collapsed lines)", async () => {
    const scrollToLine = jest.fn();
    renderWithRouterMatch(
      <SideBar
        maxLineNumber={4}
        processedLogLines={[[0, 1, 2], 3, 4]}
        scrollToLine={scrollToLine}
      />,
      {
        route: "?bookmarks=1,3",
      }
    );
    await userEvent.click(screen.getByDataCy("sidebar-log-line-3"));
    expect(scrollToLine).toHaveBeenCalledTimes(1);
    expect(scrollToLine).toHaveBeenCalledWith(1);
  });
});
