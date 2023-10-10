import { LogContextProvider } from "context/LogContext";
import { renderWithRouterMatch, screen } from "test_utils";
import AnsiRow from ".";

const wrapper = (logs: string[]) => {
  const provider = ({ children }: { children: React.ReactNode }) => (
    <LogContextProvider initialLogLines={logs}>{children}</LogContextProvider>
  );
  return provider;
};

describe("ansiRow", () => {
  it("does not render an ansi row if getLine returns undefined", () => {
    renderWithRouterMatch(
      <AnsiRow {...ansiProps} lineIndex={99} lineNumber={99} />,
      {
        wrapper: wrapper(logLines),
      }
    );
    expect(screen.queryByDataCy("ansi-row")).toBeNull();
  });
  it("renders an ansi row if getLine returns an empty string", () => {
    renderWithRouterMatch(
      <AnsiRow {...ansiProps} lineIndex={10} lineNumber={10} />,
      {
        wrapper: wrapper(logLines),
      }
    );
    expect(screen.getByDataCy("ansi-row")).toBeInTheDocument();
  });
  it("displays a log line and its text for a given index", () => {
    renderWithRouterMatch(
      <AnsiRow {...ansiProps} lineIndex={0} lineNumber={0} />,
      {
        wrapper: wrapper(logLines),
      }
    );
    expect(screen.getByText(logLines[0])).toBeInTheDocument();
    renderWithRouterMatch(
      <AnsiRow {...ansiProps} lineIndex={1} lineNumber={1} />,
      {
        wrapper: wrapper(logLines),
      }
    );
    expect(screen.getByText(logLines[1])).toBeInTheDocument();
  });
  it("lines should be linkified if they have a url", () => {
    renderWithRouterMatch(
      <AnsiRow {...ansiProps} lineIndex={8} lineNumber={8} />,
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
  it("should highlight text that match a search term", () => {
    renderWithRouterMatch(
      <AnsiRow
        {...ansiProps}
        lineIndex={9}
        lineNumber={9}
        searchTerm={/highlight me/}
      />,
      {
        wrapper: wrapper(logLines),
      }
    );
    expect(screen.getByDataCy("highlight")).toHaveTextContent("highlight me");
  });
  it("should highlight text that have matching highlights", () => {
    renderWithRouterMatch(
      <AnsiRow
        {...ansiProps}
        highlightRegex={/highlight me/}
        lineIndex={9}
        lineNumber={9}
      />,
      {
        wrapper: wrapper(logLines),
      }
    );
    expect(screen.getByDataCy("highlight")).toHaveTextContent("highlight me");
  });

  describe("when rendering lines with priority", () => {
    it("renders a low-priority line in black", () => {
      const rgbBlack = "rgb(51, 51, 51)";

      renderWithRouterMatch(
        <AnsiRow {...priorityProps} lineIndex={0} lineNumber={0} />,
        {
          wrapper: wrapper(priorityLogLines),
        }
      );
      expect(
        screen.getByText(priorityLogLines[0].substring(8))
      ).toBeInTheDocument();
      expect(screen.getByDataCy("ansi-row")).toHaveStyle(`color: ${rgbBlack}`);
    });

    it("renders a high-priority line in red", () => {
      const rgbRed = "rgb(255, 0, 0)";

      renderWithRouterMatch(
        <AnsiRow {...priorityProps} lineIndex={3} lineNumber={3} />,
        {
          wrapper: wrapper(priorityLogLines),
        }
      );
      expect(
        screen.getByText(priorityLogLines[3].substring(8))
      ).toBeInTheDocument();
      expect(screen.getByDataCy("ansi-row")).toHaveStyle(`color: ${rgbRed}`);
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
  "Some line with a url https://www.google.com",
  "some random text that should not be highlighted but highlight me should",
  "",
];

const priorityLogLines = [
  `[P: 40] [2022/12/05 20:03:30.136] Running pre-task commands.`,
  `[P: 40] [2022/12/05 20:03:30.136] Running setup task for task group ''.`,
  `[P: 40] [2022/12/05 20:03:30.136] Running command 'shell.exec' in "install AL2 packages and Chrome" (step 1.1 of 4).`,
  `[P: 70] [2022/12/05 20:03:30.138] + '[' amazon2-cloud-small = amazon2-cloud-large ']'`,
  `[P: 70] [2022/12/05 20:03:30.138] + '[' amazon2-cloud-small = amazon2-cloud-small ']'"`,
];

const ansiProps = {
  getLine: (index: number) => logLines[index],
  scrollToLine: jest.fn(),

  prettyPrint: false,
  range: { lowerRange: 0 },
  wrap: false,
};

const priorityProps = {
  ...ansiProps,
  getLine: (index: number) => priorityLogLines[index],
};
