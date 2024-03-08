import Cookie from "js-cookie";
import { LogTypes } from "constants/enums";
import { LogContextProvider } from "context/LogContext";
import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import PrettyPrintToggle from ".";

jest.mock("js-cookie");
const mockedGet = Cookie.get as unknown as jest.Mock<string>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
);

describe("pretty print toggle", () => {
  beforeEach(() => {
    mockedGet.mockImplementation(() => "true");
  });

  it("defaults to 'false' if cookie is unset", () => {
    mockedGet.mockImplementation(() => "");
    render(<PrettyPrintToggle logType={LogTypes.RESMOKE_LOGS} />, { wrapper });
    const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
    expect(prettyPrintToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should read from the cookie properly", () => {
    render(<PrettyPrintToggle logType={LogTypes.RESMOKE_LOGS} />, { wrapper });
    const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
    expect(prettyPrintToggle).toHaveAttribute("aria-checked", "true");
  });

  it("should disable the toggle if the logType is not resmoke", () => {
    render(<PrettyPrintToggle logType={LogTypes.EVERGREEN_TASK_FILE} />, {
      wrapper,
    });
    const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
    expect(prettyPrintToggle).toHaveAttribute("aria-disabled", "true");
  });

  it("should not disable the toggle if the logType is resmoke", () => {
    render(<PrettyPrintToggle logType={LogTypes.RESMOKE_LOGS} />, { wrapper });
    const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
    expect(prettyPrintToggle).toHaveAttribute("aria-disabled", "false");
  });

  it("should not update the URL", async () => {
    const user = userEvent.setup();
    const { router } = render(
      <PrettyPrintToggle logType={LogTypes.RESMOKE_LOGS} />,
      { wrapper },
    );
    const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
    await user.click(prettyPrintToggle);
    expect(prettyPrintToggle).toHaveAttribute("aria-checked", "false");
    expect(router.state.location.search).toBe("");
  });
});
