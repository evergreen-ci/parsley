import { LogContextProvider } from "context/LogContext";
import { renderWithRouterMatch, screen } from "test_utils";
import AnsiiRow from ".";

const wrapper = (logs: string[]) => {
  const provider = ({ children }: { children: React.ReactNode }) => (
    <LogContextProvider initialLogLines={logs}>{children}</LogContextProvider>
  );
  return provider;
};

describe("ansiiRow", () => {
  it("does not render an ansii row if getLine returns undefined", () => {
    renderWithRouterMatch(
      <AnsiiRow {...ansiiProps} lineIndex={99} lineNumber={99} />,
      {
        wrapper: wrapper(logLines),
      }
    );
    expect(screen.queryByDataCy("ansii-row")).toBeNull();
  });
  it("renders an ansii row if getLine returns an empty string", () => {
    renderWithRouterMatch(
      <AnsiiRow {...ansiiProps} lineIndex={10} lineNumber={10} />,
      {
        wrapper: wrapper(logLines),
      }
    );
    expect(screen.getByDataCy("ansii-row")).toBeInTheDocument();
  });
  it("displays a log line and its text for a given index", () => {
    renderWithRouterMatch(
      <AnsiiRow {...ansiiProps} lineIndex={0} lineNumber={0} />,
      {
        wrapper: wrapper(logLines),
      }
    );
    expect(screen.getByText(logLines[0])).toBeInTheDocument();
    renderWithRouterMatch(
      <AnsiiRow {...ansiiProps} lineIndex={1} lineNumber={1} />,
      {
        wrapper: wrapper(logLines),
      }
    );
    expect(screen.getByText(logLines[1])).toBeInTheDocument();
  });
  it("lines should be linkified if they have a url", () => {
    renderWithRouterMatch(
      <AnsiiRow {...ansiiProps} lineIndex={8} lineNumber={8} />,
      {
        wrapper: wrapper(logLines),
      }
    );
    expect(screen.getByText("https://www.google.com")).toBeInTheDocument();
    expect(screen.getByText("https://www.google.com")).toHaveAttribute(
      "href",
      "https://www.google.com"
    );
  });
  it("should highlight matching text if it is within range", () => {
    renderWithRouterMatch(
      <AnsiiRow
        {...ansiiProps}
        lineIndex={9}
        lineNumber={9}
        range={{ lowerRange: 0, upperRange: 10 }}
        searchTerm={/highlight me/i}
      />,
      {
        route: "?lower=0&upper=10",
        wrapper: wrapper(logLines),
      }
    );
    expect(screen.queryByDataCy("ansii-row")).toHaveTextContent("highlight me");
    expect(screen.getByDataCy("highlight")).toHaveTextContent("highlight me");
  });
  it("should not highlight matching text if it is outside of range", () => {
    renderWithRouterMatch(
      <AnsiiRow
        {...ansiiProps}
        lineIndex={9}
        lineNumber={9}
        range={{ lowerRange: 0, upperRange: 8 }}
        searchTerm={/highlight me/i}
      />,
      {
        route: "?lower=0&upper=8",
        wrapper: wrapper(logLines),
      }
    );
    expect(screen.queryByDataCy("ansii-row")).toHaveTextContent("highlight me");
    expect(screen.queryByDataCy("highlight")).not.toBeInTheDocument();
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
  "some random text that should not be highlighted but highlight me should",
  "",
];

const ansiiProps = {
  getLine: (index: number) => logLines[index],
  scrollToLine: jest.fn(),

  prettyPrint: false,
  range: { lowerRange: 0 },
  wrap: false,
};
