import { MockedProvider } from "@apollo/client/testing";
import Cookie from "js-cookie";
import { LogContextProvider } from "context/LogContext";
import { noFiltersMock } from "test_data/defaultFilters";
import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import SidePanel from ".";

jest.mock("js-cookie");
const mockedGet = Cookie.get as unknown as jest.Mock<string>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[noFiltersMock]}>
    <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
  </MockedProvider>
);

describe("sidePanel", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    // Setting the cookie to false means the drawer will be open by default, which means we
    // won't have to toggle it to test its contents.
    mockedGet.mockImplementation(() => "false");
  });

  it("should be uncollapsed if the user has never seen the filters drawer before", () => {
    render(<SidePanel {...props} />, { wrapper });
    const collapseButton = screen.getByLabelText("Collapse navigation");
    expect(collapseButton).toHaveAttribute("aria-expanded", "true");
  });

  it("should be collapsed if the user has seen the filters drawer before", () => {
    mockedGet.mockImplementation(() => "true");
    render(<SidePanel {...props} />, { wrapper });
    const collapseButton = screen.getByLabelText("Collapse navigation");
    expect(collapseButton).toHaveAttribute("aria-expanded", "false");
  });

  it("should be possible to toggle the drawer open and closed", async () => {
    render(<SidePanel {...props} />, { wrapper });
    const collapseButton = screen.getByLabelText("Collapse navigation");
    expect(collapseButton).toHaveAttribute("aria-expanded", "true");
    await user.click(collapseButton);
    expect(collapseButton).toHaveAttribute("aria-expanded", "false");
  });
});

const props = {
  expandedLines: [],
  collapseLines: jest.fn(),
  clearExpandedLines: jest.fn(),
};
