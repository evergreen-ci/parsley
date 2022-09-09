import { renderWithRouterMatch, screen, userEvent, waitFor } from "test_utils";
import SideBar from ".";

describe("sideBar", () => {
  it("sets 0 and last log line as the initial bookmarks", async () => {
    const { history } = renderWithRouterMatch(<SideBar maxLineNumber={10} />);
    await waitFor(() => {
      expect(history.location.search).toBe("?bookmarks=0,10");
    });
  });

  it("properly displays sorted bookmarks and selectedLine", () => {
    renderWithRouterMatch(<SideBar maxLineNumber={10} />, {
      route: "?bookmarks=1,7&selectedLine=5",
    });
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
    const { history } = renderWithRouterMatch(<SideBar maxLineNumber={10} />, {
      route: "?bookmarks=1,3&selectedLine=5",
    });
    userEvent.click(screen.getByDataCy("clear-bookmarks"));
    await waitFor(() => {
      expect(history.location.search).toBe("?selectedLine=5");
    });
  });
});
