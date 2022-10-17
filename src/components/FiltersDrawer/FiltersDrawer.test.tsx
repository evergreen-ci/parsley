import Cookie from "js-cookie";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  within,
} from "test_utils";
import FiltersDrawer from ".";

jest.mock("js-cookie");
const mockedGet = Cookie.get as unknown as jest.Mock<string>;

describe("filtersDrawer", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    // Setting the cookie to false means the drawer will be open by default, which means we
    // won't have to toggle it to test its contents.
    mockedGet.mockImplementation(() => "false");
  });

  it("should be uncollapsed if the user has never seen the filters drawer before", () => {
    render(<FiltersDrawer {...props} />);
    const collapseButton = screen.getByLabelText("Collapse navigation");
    expect(collapseButton).toHaveAttribute("aria-expanded", "true");
  });

  it("should be collapsed if the user has seen the filters drawer before", () => {
    mockedGet.mockImplementation(() => "true");

    render(<FiltersDrawer {...props} />);
    const collapseButton = screen.getByLabelText("Collapse navigation");
    expect(collapseButton).toHaveAttribute("aria-expanded", "false");
  });

  it("should be possible to toggle the drawer open and closed", async () => {
    render(<FiltersDrawer {...props} />);

    const collapseButton = screen.getByLabelText("Collapse navigation");
    expect(collapseButton).toHaveAttribute("aria-expanded", "true");
    await user.click(collapseButton);
    expect(collapseButton).toHaveAttribute("aria-expanded", "false");
  });

  it("shows a message when no filters have been applied", () => {
    render(<FiltersDrawer {...props} />);
    expect(screen.getByDataCy("no-filters-message")).toBeInTheDocument();
  });

  it("filters should properly display based on URL", () => {
    render(<FiltersDrawer {...props} />, {
      route: "?filters=filter1,filter2",
    });
    expect(screen.getByText("filter1")).toBeInTheDocument();
    expect(screen.getByText("filter2")).toBeInTheDocument();
  });

  it("shows the number of filters in the header", () => {
    render(<FiltersDrawer {...props} />, {
      route: "?filters=one,two,three,four",
    });
    const navGroupHeader = screen.getByDataCy("nav-group-header");
    expect(within(navGroupHeader).getByText("4")).toBeInTheDocument();
  });

  it("editing filters should modify the URL correctly", async () => {
    const { history } = render(<FiltersDrawer {...props} />, {
      route: "?filters=filter1,filter2",
    });
    // Edit the first filter.
    await user.click(screen.getAllByLabelText("Edit filter")[0]);
    await user.clear(screen.getAllByDataCy("edit-filter-name")[0]);
    await user.type(screen.getAllByDataCy("edit-filter-name")[0], "newFilter");
    const confirmButton = screen.getByRole("button", {
      name: "OK",
    });
    await user.click(confirmButton);

    expect(history.location.search).toBe("?filters=newFilter,filter2");
    expect(screen.queryByText("filter1")).not.toBeInTheDocument();
    expect(screen.getByText("newFilter")).toBeInTheDocument();
    expect(screen.getByText("filter2")).toBeInTheDocument();
  });

  it("trying to edit a filter to a filter that already exists should do nothing", async () => {
    const { history } = render(<FiltersDrawer {...props} />, {
      route: "?filters=filter1,filter2",
    });
    // Edit the first filter.
    await user.click(screen.getAllByLabelText("Edit filter")[0]);
    await user.clear(screen.getAllByDataCy("edit-filter-name")[0]);
    await user.type(screen.getAllByDataCy("edit-filter-name")[0], "filter2");
    const confirmButton = screen.getByRole("button", {
      name: "OK",
    });
    await user.click(confirmButton);

    expect(history.location.search).toBe("?filters=filter1,filter2");
    expect(screen.getByText("filter1")).toBeInTheDocument();
    expect(screen.getByText("filter2")).toBeInTheDocument();
  });

  it("pressing the cancel button after editing a filter should do nothing", async () => {
    const { history } = render(<FiltersDrawer {...props} />, {
      route: "?filters=filter1,filter2",
    });
    // Edit the first filter.
    await user.click(screen.getAllByLabelText("Edit filter")[0]);
    await user.clear(screen.getAllByDataCy("edit-filter-name")[0]);
    await user.type(screen.getAllByDataCy("edit-filter-name")[0], "newFilter");
    const cancelButton = screen.getByRole("button", {
      name: "Cancel",
    });
    await user.click(cancelButton);

    expect(history.location.search).toBe("?filters=filter1,filter2");
    expect(screen.getByText("filter1")).toBeInTheDocument();
    expect(screen.getByText("filter2")).toBeInTheDocument();
  });

  it("deleting filters should modify the URL correctly", async () => {
    const { history } = render(<FiltersDrawer {...props} />, {
      route: "?filters=filter1,filter2",
    });
    // Delete the first filter.
    await user.click(screen.getAllByLabelText("Delete filter")[0]);
    expect(history.location.search).toBe("?filters=filter2");
    expect(screen.queryByText("filter1")).not.toBeInTheDocument();
    expect(screen.getByText("filter2")).toBeInTheDocument();
  });
});

// TODO: Remove this.
const props = {
  expandedLines: [],
  collapseLines: jest.fn(),
  clearExpandedLines: jest.fn(),
};
