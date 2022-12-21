import { LogContextProvider } from "context/LogContext";
import { renderWithRouterMatch, screen, userEvent, waitFor } from "test_utils";
import ButtonRow from ".";

const wrapper = (logs: string[]) => {
  const provider = ({ children }: { children: React.ReactNode }) => (
    <LogContextProvider initialLogLines={logs}>{children}</LogContextProvider>
  );
  return provider;
};

describe("buttonRow", () => {
  const user = userEvent.setup();
  describe("jira button", () => {
    it("should be disabled when there are no bookmarks", async () => {
      renderWithRouterMatch(<ButtonRow />, {
        wrapper: wrapper(logLines),
      });
      const jiraButton = screen.getByRole("button", {
        name: "JIRA",
      });
      expect(jiraButton).toBeDisabled();
      // Tooltip should appear even if button is disabled.
      await user.hover(screen.getByDataCy("jira-button-wrapper"));
      await waitFor(() => {
        expect(screen.getByText("No bookmarks to copy.")).toBeInTheDocument();
      });
    });

    it("should indicate when the user has successfully copied to clipboard", async () => {
      renderWithRouterMatch(<ButtonRow />, {
        wrapper: wrapper(logLines),
        route: "?bookmarks=0,2",
      });
      const jiraButton = screen.getByRole("button", {
        name: "JIRA",
      });
      expect(jiraButton).toBeEnabled();
      // Tooltip text should appear on hover.
      await user.hover(jiraButton);
      await waitFor(() => {
        expect(
          screen.getByText("Copy Bookmarked Lines In Jira Format")
        ).toBeInTheDocument();
      });
      // Tooltip text should change after clicking on the button.
      await user.click(jiraButton);
      await waitFor(() => {
        expect(screen.getByText("Copied!")).toBeInTheDocument();
      });
    });

    it("should copy the correct text when clicked", async () => {
      Object.defineProperty(navigator, "clipboard", {
        value: {
          writeText: jest.fn(),
        },
      });
      renderWithRouterMatch(<ButtonRow />, {
        wrapper: wrapper(logLines),
        route: "?bookmarks=0,2,5",
      });

      const jiraButton = screen.getByRole("button", {
        name: "JIRA",
      });
      expect(jiraButton).toBeEnabled();

      await user.click(jiraButton);
      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        `{noformat}\n${logLines[0]}\n...\n${logLines[2]}\n...\n${logLines[5]}\n{noformat}`
      );
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
];
