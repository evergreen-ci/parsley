import {
  DefaultFiltersForProjectQuery,
  DefaultFiltersForProjectQueryVariables,
} from "gql/generated/types";
import { DEFAULT_FILTERS_FOR_PROJECT } from "gql/queries";
import { ApolloMock } from "types/gql";

export const projectFiltersMock: ApolloMock<
  DefaultFiltersForProjectQuery,
  DefaultFiltersForProjectQueryVariables
> = {
  request: {
    query: DEFAULT_FILTERS_FOR_PROJECT,
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

export const noFiltersMock: ApolloMock<
  DefaultFiltersForProjectQuery,
  DefaultFiltersForProjectQueryVariables
> = {
  request: {
    query: DEFAULT_FILTERS_FOR_PROJECT,
    variables: {
      projectIdentifier: "spruce",
    },
  },
  result: {
    data: {
      project: {
        __typename: "Project",
        id: "spruce",
        parsleyFilters: null,
      },
    },
  },
};
