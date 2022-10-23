import Cookie from "js-cookie";
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

  it("should read from the cookie properly", () => {
    render(<PrettyPrintToggle />, { wrapper });
    const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
    expect(prettyPrintToggle).toHaveAttribute("aria-checked", "true");
  });
  it("should not update the URL", async () => {
    const { history } = render(<PrettyPrintToggle />, { wrapper });

    const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
    await userEvent.click(prettyPrintToggle);

    expect(prettyPrintToggle).toHaveAttribute("aria-checked", "false");
    expect(history.location.search).toBe("");
  });
});
