import Cookie from "js-cookie";
import { LogContextProvider } from "context/LogContext";
import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import WordWrapFormatToggle from ".";

jest.mock("js-cookie");
const mockedGet = Cookie.get as unknown as jest.Mock<string>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
);

describe("word wrap format toggle", () => {
  beforeEach(() => {
    mockedGet.mockImplementation(() => "standard");
  });

  it("defaults to 'standard' if cookie is unset", () => {
    mockedGet.mockImplementation(() => "");
    render(<WordWrapFormatToggle />, { wrapper });
    const wordWrapFormatToggle = screen.getByDataCy("word-wrap-format-toggle");
    expect(wordWrapFormatToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should read from the cookie properly", () => {
    render(<WordWrapFormatToggle />, { wrapper });
    const wordWrapFormatToggle = screen.getByDataCy("word-wrap-format-toggle");
    expect(wordWrapFormatToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should not update the URL", async () => {
    const user = userEvent.setup();
    const { router } = render(<WordWrapFormatToggle />, { wrapper });
    const wordWrapFormatToggle = screen.getByDataCy("word-wrap-format-toggle");

    await user.click(wordWrapFormatToggle);
    expect(wordWrapFormatToggle).toHaveAttribute("aria-checked", "true");
    expect(router.state.location.search).toBe("");
  });
});
