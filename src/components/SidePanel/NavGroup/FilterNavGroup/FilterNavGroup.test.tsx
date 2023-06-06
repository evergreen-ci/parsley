import { MockedProvider } from "@apollo/client/testing";
import { LogContextProvider } from "context/LogContext";
import {
  DefaultFiltersForProjectQuery,
  DefaultFiltersForProjectQueryVariables,
} from "gql/generated/types";
import { DEFAULT_FILTERS_FOR_PROJECT } from "gql/queries";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  within,
} from "test_utils";
import { ApolloMock } from "types/gql";
import FilterNavGroup from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[noFiltersMock]}>
    <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
  </MockedProvider>
);

describe("filters", () => {
  const user = userEvent.setup();

  it("shows a message when no filters have been applied", () => {
    render(<FilterNavGroup {...props} />, { wrapper });
    expect(screen.getByDataCy("filters-default-message")).toBeInTheDocument();
  });

  it("filters should properly display based on the URL", () => {
    render(<FilterNavGroup {...props} />, {
      wrapper,
      route: "?filters=100filter1,100filter2",
    });
    expect(screen.getByText("filter1")).toBeInTheDocument();
    expect(screen.getByText("filter2")).toBeInTheDocument();
  });

  it("shows the number of filters in the header", () => {
    render(<FilterNavGroup {...props} />, {
      wrapper,
      route: "?filters=100one,100two,100three,100four",
    });
    const navGroupHeader = screen.getByDataCy("filters-nav-group-header");
    expect(within(navGroupHeader).getByText("4")).toBeInTheDocument();
  });

  it("editing filters should modify the URL correctly", async () => {
    const { history } = render(<FilterNavGroup {...props} />, {
      wrapper,
      route: "?filters=100filter1,100filter2",
    });
    // Edit the first filter.
    await user.click(screen.getAllByLabelText("Edit filter")[0]);
    await user.clear(screen.getAllByDataCy("edit-filter-name")[0]);
    await user.type(screen.getAllByDataCy("edit-filter-name")[0], "newFilter");
    const confirmButton = screen.getByRole("button", {
      name: "Apply",
    });
    await user.click(confirmButton);

    expect(history.location.search).toBe("?filters=100newFilter,100filter2");
    expect(screen.queryByText("filter1")).not.toBeInTheDocument();
    expect(screen.getByText("newFilter")).toBeInTheDocument();
    expect(screen.getByText("filter2")).toBeInTheDocument();
  });

  it("trying to edit a filter to a filter that already exists should do nothing", async () => {
    const { history } = render(<FilterNavGroup {...props} />, {
      wrapper,
      route: "?filters=100filter1,100filter2",
    });
    // Edit the first filter.
    await user.click(screen.getAllByLabelText("Edit filter")[0]);
    await user.clear(screen.getAllByDataCy("edit-filter-name")[0]);
    await user.type(screen.getAllByDataCy("edit-filter-name")[0], "filter2");
    const confirmButton = screen.getByRole("button", {
      name: "Apply",
    });
    await user.click(confirmButton);

    expect(history.location.search).toBe("?filters=100filter1,100filter2");
    expect(screen.getByText("filter1")).toBeInTheDocument();
    expect(screen.getByText("filter2")).toBeInTheDocument();
  });

  it("pressing the cancel button after editing a filter should do nothing", async () => {
    const { history } = render(<FilterNavGroup {...props} />, {
      wrapper,
      route: "?filters=100filter1,100filter2",
    });
    // Edit the first filter.
    await user.click(screen.getAllByLabelText("Edit filter")[0]);
    await user.clear(screen.getAllByDataCy("edit-filter-name")[0]);
    await user.type(screen.getAllByDataCy("edit-filter-name")[0], "newFilter");
    const cancelButton = screen.getByRole("button", {
      name: "Cancel",
    });
    await user.click(cancelButton);

    expect(history.location.search).toBe("?filters=100filter1,100filter2");
    expect(screen.getByText("filter1")).toBeInTheDocument();
    expect(screen.getByText("filter2")).toBeInTheDocument();
  });

  it("deleting filters should modify the URL correctly", async () => {
    const { history } = render(<FilterNavGroup {...props} />, {
      wrapper,
      route: "?filters=100filter1,100filter2",
    });
    // Delete the first filter.
    await user.click(screen.getAllByLabelText("Delete filter")[0]);
    expect(history.location.search).toBe("?filters=100filter2");
    expect(screen.queryByText("filter1")).not.toBeInTheDocument();
    expect(screen.getByText("filter2")).toBeInTheDocument();
  });

  it("deleting a filter should call clearExpandedLines if there are no longer any filters applied", async () => {
    const clearExpandedLines = jest.fn();
    const { history } = render(
      <FilterNavGroup {...props} clearExpandedLines={clearExpandedLines} />,
      {
        wrapper,
        route: "?filters=100filter1",
      }
    );
    await user.click(screen.getAllByLabelText("Delete filter")[0]);
    expect(history.location.search).toBe("");
    expect(clearExpandedLines).toHaveBeenCalledTimes(1);
  });
});

const props = {
  clearExpandedLines: jest.fn(),
};

const noFiltersMock: ApolloMock<
  DefaultFiltersForProjectQuery,
  DefaultFiltersForProjectQueryVariables
> = {
  request: {
    query: DEFAULT_FILTERS_FOR_PROJECT,
    variables: {
      projectIdentifier: "evergreen",
    },
  },
  result: {
    data: {
      project: {
        __typename: "Project",
        id: "evergreen",
        parsleyFilters: null,
      },
    },
  },
};
