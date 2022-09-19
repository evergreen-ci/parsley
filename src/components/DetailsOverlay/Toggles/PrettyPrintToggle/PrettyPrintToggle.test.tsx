import Cookie from "js-cookie";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import PrettyPrintToggle from ".";

jest.mock("js-cookie");
const mockedGet = Cookie.get as unknown as jest.Mock<string>;

describe("pretty print toggle", () => {
  beforeEach(() => {
    mockedGet.mockImplementation(() => "true");
  });

  it("should read from the cookie properly", () => {
    render(<PrettyPrintToggle />);
    const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
    expect(prettyPrintToggle).toHaveAttribute("aria-checked", "true");
  });
  it("should not update the URL", async () => {
    const { history } = render(<PrettyPrintToggle />);

    const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
    userEvent.click(prettyPrintToggle);
    await waitFor(() => {
      expect(prettyPrintToggle).toHaveAttribute("aria-checked", "false");
    });
    expect(history.location.search).toBe("");
  });
});
