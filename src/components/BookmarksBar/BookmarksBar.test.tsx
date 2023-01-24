import { renderWithRouterMatch, screen, userEvent, waitFor } from "test_utils";
import BookmarksBar from ".";

describe("bookmarks bar", () => {
  it("should not add bookmarks if there are no log lines", async () => {
    const { history } = renderWithRouterMatch(
      <BookmarksBar
        lineCount={0}
        processedLogLines={[]}
        scrollToLine={jest.fn()}
      />
    );
    await waitFor(() => {
      expect(history.location.search).toBe("");
    });
  });

  it("should add a single bookmark of 0 if there is only a single log line", async () => {
    const { history } = renderWithRouterMatch(
      <BookmarksBar
        lineCount={1}
        processedLogLines={[1]}
        scrollToLine={jest.fn()}
      />
    );
    await waitFor(() => {
      expect(history.location.search).toBe("?bookmarks=0");
    });
  });

  it("should set 0 and last log line as the initial bookmarks", async () => {
    const { history } = renderWithRouterMatch(
      <BookmarksBar
        lineCount={11}
        processedLogLines={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        scrollToLine={jest.fn()}
      />
    );
    await waitFor(() => {
      expect(history.location.search).toBe("?bookmarks=0,10");
    });
  });

  it("should properly display sorted bookmarks and shareLine", () => {
    renderWithRouterMatch(
      <BookmarksBar
        lineCount={11}
        processedLogLines={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        scrollToLine={jest.fn()}
      />,
      {
        route: "?bookmarks=1,7&shareLine=5",
      }
    );
    const { children } = screen.getByDataCy("bookmark-list");
    expect(children).toHaveLength(3);
    expect((children.item(0) as Element).textContent).toContain("1");
    expect((children.item(1) as Element).textContent).toContain("5");
    expect((children.item(1) as Element).children.item(1)).toStrictEqual(
      screen.getByLabelText("Link Icon")
    );
    expect((children.item(2) as Element).textContent).toContain("7");
  });

  it("should be able to clear all bookmarks without removing share line", async () => {
    const { history } = renderWithRouterMatch(
      <BookmarksBar
        lineCount={11}
        processedLogLines={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        scrollToLine={jest.fn()}
      />,
      {
        route: "?bookmarks=1,3&shareLine=5",
      }
    );
    await userEvent.click(screen.getByDataCy("clear-bookmarks"));
    expect(history.location.search).toBe("?shareLine=5");
  });

  it("should call scrollToLine when clicking on a log line (with no collapsed lines)", async () => {
    const scrollToLine = jest.fn();
    renderWithRouterMatch(
      <BookmarksBar
        lineCount={5}
        processedLogLines={[0, 1, 2, 3, 4]}
        scrollToLine={scrollToLine}
      />,
      {
        route: "?bookmarks=1,3",
      }
    );
    await userEvent.click(screen.getByDataCy("bookmark-3"));
    expect(scrollToLine).toHaveBeenCalledTimes(1);
    expect(scrollToLine).toHaveBeenCalledWith(3);
  });

  it("should call scrollToLine when clicking on a log line (with collapsed lines)", async () => {
    const scrollToLine = jest.fn();
    renderWithRouterMatch(
      <BookmarksBar
        lineCount={5}
        processedLogLines={[[0, 1, 2], 3, 4]}
        scrollToLine={scrollToLine}
      />,
      {
        route: "?bookmarks=1,3",
      }
    );
    await userEvent.click(screen.getByDataCy("bookmark-3"));
    expect(scrollToLine).toHaveBeenCalledTimes(1);
    expect(scrollToLine).toHaveBeenCalledWith(1);
  });
});
