import Cookie from "js-cookie";
import { LogContextProvider } from "context/LogContext";
import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import WrapToggle from ".";

jest.mock("js-cookie");
const mockedGet = Cookie.get as unknown as jest.Mock<string>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
);

describe("wrap toggle", () => {
  beforeEach(() => {
    mockedGet.mockImplementation(() => "true");
  });

  it("should read from the cookie properly", () => {
    render(<WrapToggle />, { wrapper });
    const prettyPrintToggle = screen.getByDataCy("wrap-toggle");
    expect(prettyPrintToggle).toHaveAttribute("aria-checked", "true");
  });

  it("should update the URL correctly", async () => {
    const { history } = render(<WrapToggle />, { wrapper });

    const wrapToggle = screen.getByDataCy("wrap-toggle");
    expect(wrapToggle).toHaveAttribute("aria-checked", "true");

    await userEvent.click(wrapToggle);

    expect(wrapToggle).toHaveAttribute("aria-checked", "false");
    expect(history.location.search).toBe("?wrap=false");
  });

  it("url params take precedence over cookie value", () => {
    render(<WrapToggle />, {
      wrapper,
      route: "?wrap=false",
    });
    const wrapToggle = screen.getByDataCy("wrap-toggle");
    expect(wrapToggle).toHaveAttribute("aria-checked", "false");
  });
});
