import Cookie from "js-cookie";
import { LogContextProvider } from "context/LogContext";
import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import ExpandableRowsToggle from ".";

jest.mock("js-cookie");
const mockedGet = Cookie.get as unknown as jest.Mock<string>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
);

describe("expandable rows toggle", () => {
  beforeEach(() => {
    mockedGet.mockImplementation(() => "true");
  });

  it("defaults to 'true' if cookie is unset", () => {
    mockedGet.mockImplementation(() => "");
    render(<ExpandableRowsToggle />, { wrapper });
    const expandableRowsToggle = screen.getByDataCy("expandable-rows-toggle");
    expect(expandableRowsToggle).toHaveAttribute("aria-checked", "true");
  });

  it("should read from the cookie properly", () => {
    render(<ExpandableRowsToggle />, { wrapper });
    const expandableRowsToggle = screen.getByDataCy("expandable-rows-toggle");
    expect(expandableRowsToggle).toHaveAttribute("aria-checked", "true");
  });

  it("should update the URL correctly", async () => {
    const user = userEvent.setup();
    const { router } = render(<ExpandableRowsToggle />, { wrapper });

    const expandableRowsToggle = screen.getByDataCy("expandable-rows-toggle");
    expect(expandableRowsToggle).toHaveAttribute("aria-checked", "true");

    await user.click(expandableRowsToggle);
    expect(expandableRowsToggle).toHaveAttribute("aria-checked", "false");
    expect(router.state.location.search).toBe("?expandable=false");
  });

  it("url params should take precedence over cookie value", () => {
    render(<ExpandableRowsToggle />, {
      route: "?expandable=false",
      wrapper,
    });
    const expandableRowsToggle = screen.getByDataCy("expandable-rows-toggle");
    expect(expandableRowsToggle).toHaveAttribute("aria-checked", "false");
  });
});
