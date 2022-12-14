import Cookie from "js-cookie";
import { LogContextProvider } from "context/LogContext";
import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import FilterLogicToggle from ".";

jest.mock("js-cookie");
const mockedGet = Cookie.get as unknown as jest.Mock<string>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
);

describe("filter logic toggle", () => {
  beforeEach(() => {
    mockedGet.mockImplementation(() => "or");
  });

  it("defaults to 'and' if cookie is unset", () => {
    mockedGet.mockImplementation(() => "");
    render(<FilterLogicToggle />, { wrapper });
    const expandableRowsToggle = screen.getByDataCy("filter-logic-toggle");
    expect(expandableRowsToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should read from the cookie properly", () => {
    render(<FilterLogicToggle />, { wrapper });
    const expandableRowsToggle = screen.getByDataCy("filter-logic-toggle");
    expect(expandableRowsToggle).toHaveAttribute("aria-checked", "true");
  });

  it("should update the URL correctly", async () => {
    const { history } = render(<FilterLogicToggle />, { wrapper });

    const filterLogicToggle = screen.getByDataCy("filter-logic-toggle");
    expect(filterLogicToggle).toHaveAttribute("aria-checked", "true");

    await userEvent.click(filterLogicToggle);
    expect(filterLogicToggle).toHaveAttribute("aria-checked", "false");
    expect(history.location.search).toBe("?filterLogic=and");

    await userEvent.click(filterLogicToggle);
    expect(filterLogicToggle).toHaveAttribute("aria-checked", "true");
    expect(history.location.search).toBe("?filterLogic=or");
  });

  it("url params take precedence over cookie value", () => {
    render(<FilterLogicToggle />, {
      wrapper,
      route: "?filterLogic=and",
    });
    const filterLogicToggle = screen.getByDataCy("filter-logic-toggle");
    expect(filterLogicToggle).toHaveAttribute("aria-checked", "false");
  });
});
