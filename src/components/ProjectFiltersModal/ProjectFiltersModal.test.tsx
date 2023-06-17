import { MockedProvider, MockedProviderProps } from "@apollo/client/testing";
import { act } from "@testing-library/react-hooks";
import { LogTypes } from "constants/enums";
import { LogContextProvider, useLogContext } from "context/LogContext";
import {
  ProjectFiltersQuery,
  ProjectFiltersQueryVariables,
} from "gql/generated/types";
import { PROJECT_FILTERS } from "gql/queries";
import { noFiltersMock } from "test_data/projectFilters";
import { evergreenTaskMock } from "test_data/task";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import { renderComponentWithHook } from "test_utils/TestHooks";
import { ApolloMock } from "types/gql";
import ProjectFiltersModal from ".";

const wrapper = (mocks: MockedProviderProps["mocks"]) => {
  const provider = ({ children }: { children: React.ReactNode }) => (
    <MockedProvider mocks={mocks}>
      <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
    </MockedProvider>
  );
  return provider;
};

describe("projectFiltersModal", () => {
  it("shows message when no filters are defined in project", () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <ProjectFiltersModal open setOpen={jest.fn()} />
    );
    render(<Component />, {
      wrapper: wrapper([noFiltersMock, evergreenTaskMock]),
    });
    act(() => {
      hook.current.setLogMetadata(logMetadata);
    });
    expect(screen.getByDataCy("no-filters-message")).toBeInTheDocument();
  });

  it("lists all of a project's filters", async () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <ProjectFiltersModal open setOpen={jest.fn()} />
    );
    render(<Component />, {
      wrapper: wrapper([projectFiltersMock, evergreenTaskMock]),
    });
    act(() => {
      hook.current.setLogMetadata(logMetadata);
    });
    await waitForModalLoad();
    expect(screen.queryByText("my_filter_1")).toBeVisible();
    expect(screen.queryByText("my_filter_2")).toBeVisible();
    expect(screen.queryByText("my_filter_3")).toBeVisible();
  });

  it("if a filter is already included in the URL, its checkbox will be checked & disabled", async () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <ProjectFiltersModal open setOpen={jest.fn()} />
    );
    render(<Component />, {
      wrapper: wrapper([projectFiltersMock, evergreenTaskMock]),
      route: "?filters=100my_filter_1",
    });
    act(() => {
      hook.current.setLogMetadata(logMetadata);
    });
    await waitForModalLoad();
    const user = userEvent.setup();
    await user.hover(screen.getByLabelText("Info With Circle Icon"));
    await waitFor(() => {
      expect(screen.queryByDataCy("project-filter-tooltip")).toBeVisible();
    });
    const checkbox = screen.getAllByRole("checkbox")[0];
    expect(checkbox).toBeChecked();
    expect(checkbox).toBeDisabled();
  });

  it("disables submit button when no filters have been selected", async () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <ProjectFiltersModal open setOpen={jest.fn()} />
    );
    render(<Component />, {
      wrapper: wrapper([projectFiltersMock, evergreenTaskMock]),
    });
    act(() => {
      hook.current.setLogMetadata(logMetadata);
    });
    await waitForModalLoad();
    expect(
      screen.queryByRole("button", { name: "Apply filters" })
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("properly applies filters to the URL", async () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <ProjectFiltersModal open setOpen={jest.fn()} />
    );
    const { history } = render(<Component />, {
      wrapper: wrapper([projectFiltersMock, evergreenTaskMock]),
      route: "?filters=100original",
    });
    act(() => {
      hook.current.setLogMetadata(logMetadata);
    });
    await waitForModalLoad();
    const user = userEvent.setup();
    // LeafyGreen checkbox has pointer-events: none so we click on the labels as a workaround.
    await user.click(screen.getByText("my_filter_2"));
    await user.click(screen.getByText("my_filter_3"));
    expect(
      screen.queryByRole("button", { name: "Apply filters" })
    ).toHaveAttribute("aria-disabled", "false");
    await user.click(screen.getByRole("button", { name: "Apply filters" }));
    expect(history.location.search).toBe(
      "?filters=100original,111my_filter_2,101my_filter_3"
    );
  });
});

const waitForModalLoad = async () => {
  await waitFor(() =>
    expect(screen.queryByDataCy("project-filters-modal")).toBeVisible()
  );
  await waitFor(() =>
    expect(screen.queryAllByDataCy("project-filter")).toHaveLength(3)
  );
};

const logMetadata = {
  taskID:
    "spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35",
  execution: "0",
  logType: LogTypes.EVERGREEN_TASK_LOGS,
};

const projectFiltersMock: ApolloMock<
  ProjectFiltersQuery,
  ProjectFiltersQueryVariables
> = {
  request: {
    query: PROJECT_FILTERS,
    variables: {
      projectIdentifier: "spruce",
    },
  },
  result: {
    data: {
      project: {
        __typename: "Project",
        id: "spruce",
        parsleyFilters: [
          {
            __typename: "ParsleyFilter",
            caseSensitive: true,
            exactMatch: true,
            expression: "my_filter_1",
          },
          {
            __typename: "ParsleyFilter",
            caseSensitive: true,
            exactMatch: false,
            expression: "my_filter_2",
          },
          {
            __typename: "ParsleyFilter",
            caseSensitive: false,
            exactMatch: false,
            expression: "my_filter_3",
          },
        ],
      },
    },
  },
};
