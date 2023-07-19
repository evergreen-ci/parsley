import Cookie from "js-cookie";
import { LogContextProvider } from "context/LogContext";
import { mockUseToastContext } from "context/toast/__mocks__";
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
    mockUseToastContext();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("defaults to 'and' if cookie is unset", () => {
    mockedGet.mockImplementation(() => "");
    render(<FilterLogicToggle />, { wrapper });
    const filterLogicToggle = screen.getByDataCy("filter-logic-toggle");
    expect(filterLogicToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should read from the cookie properly", () => {
    render(<FilterLogicToggle />, { wrapper });
    const filterLogicToggle = screen.getByDataCy("filter-logic-toggle");
    expect(filterLogicToggle).toHaveAttribute("aria-checked", "true");
  });

  it("should update the URL correctly", async () => {
    const { router } = render(<FilterLogicToggle />, { wrapper });

    const filterLogicToggle = screen.getByDataCy("filter-logic-toggle");
    expect(filterLogicToggle).toHaveAttribute("aria-checked", "true");

    const user = userEvent.setup();
    await user.click(filterLogicToggle);
    expect(filterLogicToggle).toHaveAttribute("aria-checked", "false");
    expect(router.state.location.search).toBe("?filterLogic=and");

    await user.click(filterLogicToggle);
    expect(filterLogicToggle).toHaveAttribute("aria-checked", "true");
    expect(router.state.location.search).toBe("?filterLogic=or");
  });

  it("url params should take precedence over cookie value", () => {
    render(<FilterLogicToggle />, {
      wrapper,
      route: "?filterLogic=and",
    });
    const filterLogicToggle = screen.getByDataCy("filter-logic-toggle");
    expect(filterLogicToggle).toHaveAttribute("aria-checked", "false");
  });
});
