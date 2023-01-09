import { LogContextProvider } from "context/LogContext";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  within,
} from "test_utils";
import HighlightNavGroup from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
);

describe("highlights", () => {
  const user = userEvent.setup();

  it("shows a message when there are no highlighted terms", () => {
    render(<HighlightNavGroup />, { wrapper });
    expect(screen.getByDataCy("highlight-default-message")).toBeInTheDocument();
  });

  it("highlighted terms should properly display based on the URL", () => {
    render(<HighlightNavGroup />, {
      route: "?highlights=one,two",
      wrapper,
    });
    expect(screen.getByText("one")).toBeInTheDocument();
    expect(screen.getByText("two")).toBeInTheDocument();
  });

  it("shows the number of highlighted terms in the header", () => {
    render(<HighlightNavGroup />, {
      route: "?highlights=one,two,three,four",
      wrapper,
    });
    const navGroupHeader = screen.getByDataCy("highlight-nav-group-header");
    expect(within(navGroupHeader).getByText("4")).toBeInTheDocument();
  });

  it("deleting highlighted terms should modify the URL correctly", async () => {
    const { history } = render(<HighlightNavGroup />, {
      route: "?highlights=one,two",
      wrapper,
    });
    // Delete the first highlight.
    await user.click(screen.getAllByLabelText("Delete highlight")[0]);
    expect(history.location.search).toBe("?highlights=two");
    expect(screen.queryByText("one")).not.toBeInTheDocument();
    expect(screen.getByText("two")).toBeInTheDocument();
  });
});
