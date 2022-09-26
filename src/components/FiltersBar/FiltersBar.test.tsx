import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  within,
} from "test_utils";
import FiltersBar from ".";

describe("filtersOverlay", () => {
  const user = userEvent.setup();

  it("shows a message when no filters have been applied", async () => {
    render(<FiltersBar />);
    // The FiltersBar is rendered in a collapsed state, so we need to open it for the tests.
    await user.click(screen.getByLabelText("Collapse navigation"));
    expect(screen.getByDataCy("no-filters-message")).toBeInTheDocument();
  });

  it("filters should properly display based on URL", async () => {
    render(<FiltersBar />, {
      route: "?filters=filter1,filter2",
    });
    await user.click(screen.getByLabelText("Collapse navigation"));

    expect(screen.getByText("filter1")).toBeInTheDocument();
    expect(screen.getByText("filter2")).toBeInTheDocument();
  });

  it("shows the number of filters in the header", async () => {
    render(<FiltersBar />, {
      route: "?filters=one,two,three,four",
    });
    await user.click(screen.getByLabelText("Collapse navigation"));

    const navGroupHeader = screen.getByDataCy("nav-group-header");
    expect(within(navGroupHeader).getByText("4")).toBeInTheDocument();
  });

  it("deleting filters should modify the URL correctly", async () => {
    const { history } = render(<FiltersBar />, {
      route: "?filters=filter1,filter2",
    });
    await user.click(screen.getByLabelText("Collapse navigation"));

    // Delete the first filter.
    await user.click(screen.getAllByLabelText("Delete filter button")[0]);
    expect(history.location.search).toBe("?filters=filter2");
    expect(screen.queryByText("filter1")).not.toBeInTheDocument();
    expect(screen.getByText("filter2")).toBeInTheDocument();
  });

  it("editing filters should modify the URL correctly", async () => {
    const { history } = render(<FiltersBar />, {
      route: "?filters=filter1,filter2",
    });
    await user.click(screen.getByLabelText("Collapse navigation"));

    // Edit the first filter.
    await user.click(screen.getAllByLabelText("Edit filter button")[0]);
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
    const { history } = render(<FiltersBar />, {
      route: "?filters=filter1,filter2",
    });
    await user.click(screen.getByLabelText("Collapse navigation"));

    // Edit the first filter.
    await user.click(screen.getAllByLabelText("Edit filter button")[0]);
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
    const { history } = render(<FiltersBar />, {
      route: "?filters=filter1,filter2",
    });
    await user.click(screen.getByLabelText("Collapse navigation"));

    // Edit the first filter.
    await user.click(screen.getAllByLabelText("Edit filter button")[0]);
    await user.type(screen.getAllByDataCy("edit-filter-name")[0], "newFilter");
    const cancelButton = screen.getByRole("button", {
      name: "Cancel",
    });
    await user.click(cancelButton);

    expect(history.location.search).toBe("?filters=filter1,filter2");
    expect(screen.getByText("filter1")).toBeInTheDocument();
    expect(screen.getByText("filter2")).toBeInTheDocument();
  });
});
