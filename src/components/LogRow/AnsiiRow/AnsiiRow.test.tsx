import { LogTypes } from "constants/enums";
import { LogContextProvider } from "context/LogContext";
import { renderWithRouterMatch, screen, userEvent, waitFor } from "test_utils";
import AnsiiRow from ".";

const wrapper = (logs: string[]) => {
  const provider = ({ children }: { children: React.ReactNode }) => (
    <LogContextProvider initialLogLines={logs}>{children}</LogContextProvider>
  );
  return provider;
};

describe("ansiiRow", () => {
  it("displays a log line and its text for a given index", () => {
    renderWithRouterMatch(
      <AnsiiRow data={data} listRowProps={listRowProps} />,
      {
        wrapper: wrapper(logLines),
      }
    );
    expect(screen.getByText(logLines[0])).toBeInTheDocument();
    renderWithRouterMatch(
      <AnsiiRow data={data} listRowProps={{ ...listRowProps, index: 1 }} />,
      {
        wrapper: wrapper(logLines),
      }
    );
    expect(screen.getByText(logLines[1])).toBeInTheDocument();
  });
  it("clicking log line link updates the url and selects it", async () => {
    const { history } = renderWithRouterMatch(
      <AnsiiRow data={data} listRowProps={listRowProps} />,
      {
        wrapper: wrapper(logLines),
      }
    );
    userEvent.click(screen.getByDataCy("log-link-0"));
    await waitFor(() => {
      expect(history.location.search).toBe("?selectedLine=0");
    });
  });
  it("clicking on a selected log line link unselects it", async () => {
    const { history } = renderWithRouterMatch(
      <AnsiiRow data={data} listRowProps={listRowProps} />,

      {
        wrapper: wrapper(logLines),
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
      <AnsiiRow data={data} listRowProps={listRowProps} />,
      {
        wrapper: wrapper(logLines),
      }
    );
    userEvent.dblClick(screen.getByText(logLines[0]));
    await waitFor(() => {
      expect(history.location.search).toBe("?bookmarks=0");
    });
  });
  it("double clicking a bookmarked log line removes it from the bookmarks", async () => {
    const { history } = renderWithRouterMatch(
      <AnsiiRow data={data} listRowProps={listRowProps} />,
      {
        wrapper: wrapper(logLines),
        route: "?bookmarks=0",
      }
    );
    userEvent.dblClick(screen.getByText(logLines[0]));
    await waitFor(() => {
      expect(history.location.search).toBe("");
    });
  });
  it("lines should be linkified if they have a url", () => {
    renderWithRouterMatch(
      <AnsiiRow data={data} listRowProps={{ ...listRowProps, index: 8 }} />,
      {
        wrapper: wrapper(["Some line with a url https://www.google.com"]),
      }
    );
    expect(screen.getByText("https://www.google.com")).toBeInTheDocument();
    expect(screen.getByText("https://www.google.com")).toHaveAttribute(
      "href",
      "https://www.google.com"
    );
  });
});

const logLines = [
  "[2022/08/30 14:53:58.774] [grip] 2022/08/30 14:53:17 [p=debug]: [commit='536cdcab21b907c87cd14751ad523ad1d8f23d07' operation='github api query' query='536cdcab21b907c87cd14751ad523ad1d8f23d07' repo='evergreen-ci/evergreen' size='-1' status='200 OK']",
  "[2022/08/30 14:53:58.774] [grip] 2022/08/30 14:53:17 [p=debug]: [message='created build' name='lint' project='mci' project_identifier='' runner='repotracker' version='_536cdcab21b907c87cd14751ad523ad1d8f23d07']",
  "[2022/08/30 14:53:58.774] [grip] 2022/08/30 14:53:17 [p=debug]: [message='created build' name='osx' project='mci' project_identifier='' runner='repotracker' version='_536cdcab21b907c87cd14751ad523ad1d8f23d07']",
  "[2022/08/30 14:53:58.774] [grip] 2022/08/30 14:53:17 [p=debug]: [message='created build' name='race-detector' project='mci' project_identifier='' runner='repotracker' version='_536cdcab21b907c87cd14751ad523ad1d8f23d07']",
  "[2022/08/30 14:53:58.774] [grip] 2022/08/30 14:53:17 [p=debug]: [message='created build' name='ubuntu1604' project='mci' project_identifier='' runner='repotracker' version='_536cdcab21b907c87cd14751ad523ad1d8f23d07']",
  "[2022/08/30 14:53:58.774] [grip] 2022/08/30 14:53:17 [p=debug]: [message='created build' name='ubuntu1804-arm64' project='mci' project_identifier='' runner='repotracker' version='_536cdcab21b907c87cd14751ad523ad1d8f23d07']",
  "[2022/08/30 14:53:58.774] [grip] 2022/08/30 14:53:17 [p=debug]: [message='created build' name='windows' project='mci' project_identifier='' runner='repotracker' version='_536cdcab21b907c87cd14751ad523ad1d8f23d07']",
  "[2022/08/30 14:53:58.774] [grip] 2022/08/30 14:53:17 [p=info]: [hash='536cdcab21b907c87cd14751ad523ad1d8f23d07' message='successfully created version' project='mci' runner='repotracker' version='_536cdcab21b907c87cd14751ad523ad1d8f23d07']",
  "Some line with a url https://www.google.com",
];

const listRowProps = {
  key: logLines[0],
  columnIndex: 0,
  index: 0,
  isScrolling: false,
  isVisible: true,
  parent: {} as any,
  style: {},
};
const getLine = (index: number) => logLines[index];

const data = {
  getLine,
  wrap: false,
  processedLines: logLines.map((_, index) => index),
  logType: LogTypes.RESMOKE_LOGS,
};
