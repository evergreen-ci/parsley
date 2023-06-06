import { useEffect, useState } from "react";
import { MockedProvider } from "@apollo/client/testing";
import { StoryObj } from "@storybook/react";
import { useLogContext } from "context/LogContext";
import {
  DefaultFiltersForProjectQuery,
  DefaultFiltersForProjectQueryVariables,
} from "gql/generated/types";
import { DEFAULT_FILTERS_FOR_PROJECT } from "gql/queries";
import { useQueryParams } from "hooks/useQueryParam";
import { ApolloMock } from "types/gql";
import ApplyFiltersModal from ".";

export default {
  component: ApplyFiltersModal,
};

const Component = ({ ...args }) => {
  const { setTaskMetadata } = useLogContext();
  const [, setSearchParams] = useQueryParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTaskMetadata({ projectIdentifier: "evergreen" });
    setSearchParams({ filters: ["100active%20filter"] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <button onClick={() => setOpen(true)} type="button">
        Open modal
      </button>
      <ApplyFiltersModal {...args} open={open} setOpen={setOpen} />
    </>
  );
};

export const Default: StoryObj<typeof ApplyFiltersModal> = {
  render: (args) => <Component {...args} />,
  decorators: [
    (Story: () => JSX.Element) => (
      <MockedProvider mocks={[defaultFiltersMock]}>
        <Story />
      </MockedProvider>
    ),
  ],
};

export const Empty: StoryObj<typeof ApplyFiltersModal> = {
  render: (args) => <Component {...args} />,
  decorators: [
    (Story: () => JSX.Element) => (
      <MockedProvider mocks={[noFiltersMock]}>
        <Story />
      </MockedProvider>
    ),
  ],
};

const defaultFiltersMock: ApolloMock<
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
        parsleyFilters: [
          {
            __typename: "ParsleyFilter",
            caseSensitive: true,
            exactMatch: true,
            expression:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          },
          {
            __typename: "ParsleyFilter",
            caseSensitive: true,
            exactMatch: false,
            expression: "active filter",
          },
          {
            __typename: "ParsleyFilter",
            caseSensitive: false,
            exactMatch: false,
            expression: ":D",
          },
        ],
      },
    },
  },
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
