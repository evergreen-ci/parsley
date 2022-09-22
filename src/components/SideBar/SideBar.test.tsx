import { renderWithRouterMatch, screen, userEvent, waitFor } from "test_utils";
import SideBar from ".";

describe("sideBar", () => {
  it("sets 0 and last log line as the initial bookmarks", async () => {
    const { history } = renderWithRouterMatch(
      <SideBar
        maxLineNumber={10}
        processedLogLines={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        setScrollIndex={jest.fn()}
      />
    );
    await waitFor(() => {
      expect(history.location.search).toBe("?bookmarks=0,10");
    });
  });

  it("properly displays sorted bookmarks and selectedLine", () => {
    renderWithRouterMatch(
      <SideBar
        maxLineNumber={10}
        processedLogLines={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        setScrollIndex={jest.fn()}
      />,
      {
        route: "?bookmarks=1,7&selectedLine=5",
      }
    );
    const { children } = screen.getByDataCy("log-line-container");
    expect(children).toHaveLength(3);
    expect(children.item(0)?.textContent).toContain("1");
    expect(children.item(1)?.textContent).toContain("5");
    expect(children.item(1)?.children?.item(1)).toStrictEqual(
      screen.getByLabelText("Link Icon")
    );
    expect(children.item(2)?.textContent).toContain("7");
  });

  it("should be able to clear all bookmarks without removing selected line", async () => {
    const { history } = renderWithRouterMatch(
      <SideBar
        maxLineNumber={10}
        processedLogLines={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        setScrollIndex={jest.fn()}
      />,
      {
        route: "?bookmarks=1,3&selectedLine=5",
      }
    );
    await userEvent.click(screen.getByDataCy("clear-bookmarks"));
    expect(history.location.search).toBe("?selectedLine=5");
  });

  it("setScrollIndex should be called when clicking on a log line (no collapsed lines)", async () => {
    const setScrollIndex = jest.fn();
    renderWithRouterMatch(
      <SideBar
        maxLineNumber={4}
        processedLogLines={[0, 1, 2, 3, 4]}
        setScrollIndex={setScrollIndex}
      />,
      {
        route: "?bookmarks=1,3",
      }
    );
    await userEvent.click(screen.getByDataCy("log-line-3"));
    expect(setScrollIndex).toHaveBeenCalledTimes(1);
    expect(setScrollIndex).toHaveBeenCalledWith(3);
  });

  it("setScrollIndex should be called when clicking on a log line (collapsed lines)", async () => {
    const setScrollIndex = jest.fn();
    renderWithRouterMatch(
      <SideBar
        maxLineNumber={4}
        processedLogLines={[[0, 1, 2], 3, 4]}
        setScrollIndex={setScrollIndex}
      />,
      {
        route: "?bookmarks=1,3",
      }
    );
    await userEvent.click(screen.getByDataCy("log-line-3"));
    expect(setScrollIndex).toHaveBeenCalledTimes(1);
    expect(setScrollIndex).toHaveBeenCalledWith(1);
  });
});
