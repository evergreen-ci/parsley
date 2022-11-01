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

  describe("filters", () => {
    it("shows a message when no filters have been applied", () => {
      render(<FiltersDrawer {...props} />);
      expect(screen.getByDataCy("no-filters-message")).toBeInTheDocument();
    });

    it("filters should properly display based on URL", () => {
      render(<FiltersDrawer {...props} />, {
        route: "?filters=100filter1,100filter2",
      });
      expect(screen.getByText("filter1")).toBeInTheDocument();
      expect(screen.getByText("filter2")).toBeInTheDocument();
    });

    it("shows the number of filters in the header", () => {
      render(<FiltersDrawer {...props} />, {
        route: "?filters=100one,100two,100three,100four",
      });
      const navGroupHeader = screen.getByDataCy("filters-nav-group-header");
      expect(within(navGroupHeader).getByText("4")).toBeInTheDocument();
    });

    it("editing filters should modify the URL correctly", async () => {
      const { history } = render(<FiltersDrawer {...props} />, {
        route: "?filters=100filter1,100filter2",
      });
      // Edit the first filter.
      await user.click(screen.getAllByLabelText("Edit filter")[0]);
      await user.clear(screen.getAllByDataCy("edit-filter-name")[0]);
      await user.type(
        screen.getAllByDataCy("edit-filter-name")[0],
        "newFilter"
      );
      const confirmButton = screen.getByRole("button", {
        name: "OK",
      });
      await user.click(confirmButton);

      expect(history.location.search).toBe("?filters=100newFilter,100filter2");
      expect(screen.queryByText("filter1")).not.toBeInTheDocument();
      expect(screen.getByText("newFilter")).toBeInTheDocument();
      expect(screen.getByText("filter2")).toBeInTheDocument();
    });

    it("trying to edit a filter to a filter that already exists should do nothing", async () => {
      const { history } = render(<FiltersDrawer {...props} />, {
        route: "?filters=100filter1,100filter2",
      });
      // Edit the first filter.
      await user.click(screen.getAllByLabelText("Edit filter")[0]);
      await user.clear(screen.getAllByDataCy("edit-filter-name")[0]);
      await user.type(screen.getAllByDataCy("edit-filter-name")[0], "filter2");
      const confirmButton = screen.getByRole("button", {
        name: "OK",
      });
      await user.click(confirmButton);

      expect(history.location.search).toBe("?filters=100filter1,100filter2");
      expect(screen.getByText("filter1")).toBeInTheDocument();
      expect(screen.getByText("filter2")).toBeInTheDocument();
    });

    it("pressing the cancel button after editing a filter should do nothing", async () => {
      const { history } = render(<FiltersDrawer {...props} />, {
        route: "?filters=100filter1,100filter2",
      });
      // Edit the first filter.
      await user.click(screen.getAllByLabelText("Edit filter")[0]);
      await user.clear(screen.getAllByDataCy("edit-filter-name")[0]);
      await user.type(
        screen.getAllByDataCy("edit-filter-name")[0],
        "newFilter"
      );
      const cancelButton = screen.getByRole("button", {
        name: "Cancel",
      });
      await user.click(cancelButton);

      expect(history.location.search).toBe("?filters=100filter1,100filter2");
      expect(screen.getByText("filter1")).toBeInTheDocument();
      expect(screen.getByText("filter2")).toBeInTheDocument();
    });

    it("deleting filters should modify the URL correctly", async () => {
      const { history } = render(<FiltersDrawer {...props} />, {
        route: "?filters=100filter1,100filter2",
      });
      // Delete the first filter.
      await user.click(screen.getAllByLabelText("Delete filter")[0]);
      expect(history.location.search).toBe("?filters=100filter2");
      expect(screen.queryByText("filter1")).not.toBeInTheDocument();
      expect(screen.getByText("filter2")).toBeInTheDocument();
    });
  });

  describe("expanded lines", () => {
    it("shows a message when no lines have been expanded", () => {
      render(<FiltersDrawer {...props} />);
      expect(
        screen.getByDataCy("no-expanded-lines-message")
      ).toBeInTheDocument();
    });

    it("expanded lines should properly display based on URL", () => {
      render(
        <FiltersDrawer
          {...props}
          expandedLines={[
            [0, 2],
            [5, 6],
          ]}
        />
      );
      expect(screen.getByText("Row 0 to 2")).toBeInTheDocument();
      expect(screen.getByText("Row 5 to 6")).toBeInTheDocument();
    });

    it("shows the number of expanded lines in the header", () => {
      render(
        <FiltersDrawer
          {...props}
          expandedLines={[
            [0, 2],
            [5, 6],
            [9, 10],
            [20, 22],
          ]}
        />
      );
      const navGroupHeader = screen.getByDataCy(
        "expanded-lines-nav-group-header"
      );
      expect(within(navGroupHeader).getByText("4")).toBeInTheDocument();
    });

    it("deleting an expanded line should call collapseLines", async () => {
      const collapseLines = jest.fn();
      render(
        <FiltersDrawer
          {...props}
          collapseLines={collapseLines}
          expandedLines={[[0, 2]]}
        />
      );
      await user.click(screen.getByLabelText("Delete range"));
      expect(collapseLines).toHaveBeenCalledTimes(1);
      expect(collapseLines).toHaveBeenCalledWith(0);
    });

    it("deleting a filter should cause clearExpandedLines if there are no longer any filters applied", async () => {
      const clearExpandedLines = jest.fn();
      const { history } = render(
        <FiltersDrawer {...props} clearExpandedLines={clearExpandedLines} />,
        {
          route: "?filters=100filter1",
        }
      );
      await user.click(screen.getAllByLabelText("Delete filter")[0]);
      expect(history.location.search).toBe("");
      expect(clearExpandedLines).toHaveBeenCalledTimes(1);
    });
  });
});

const props = {
  expandedLines: [],
  collapseLines: jest.fn(),
  clearExpandedLines: jest.fn(),
};
