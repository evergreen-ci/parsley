import { LogContextProvider } from "context/LogContext";
import { renderWithRouterMatch, screen, userEvent, waitFor } from "test_utils";
import { AnsiiRow } from ".";

const wrapper = (logs: string[]) => {
  const provider = ({ children }: { children: React.ReactNode }) => (
    <LogContextProvider initialLogLines={logs}>{children}</LogContextProvider>
  );
  return provider;
};

describe("ansiiRow", () => {
  it("displays a log line and its text for a given index", async () => {
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
  it("double clicking a log line updates the url and selects it", async () => {
    const { history } = renderWithRouterMatch(
      <AnsiiRow data={data} listRowProps={listRowProps} />,
      {
        wrapper: wrapper(logLines),
      }
    );
    userEvent.dblClick(screen.getByText(logLines[0]));
    await waitFor(() => {
      expect(history.location.search).toBe("?selectedLine=0");
    });
  });
  it("double clicking on a selected log line unselects it", async () => {
    const { history } = renderWithRouterMatch(
      <AnsiiRow data={data} listRowProps={listRowProps} />,

      {
        wrapper: wrapper(logLines),
        route: "?selectedLine=0",
      }
    );
    userEvent.dblClick(screen.getByText(logLines[0]));
    await waitFor(() => {
      expect(history.location.search).toBe("");
    });
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
};
