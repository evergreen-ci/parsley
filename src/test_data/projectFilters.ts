import {
  ProjectFiltersQuery,
  ProjectFiltersQueryVariables,
} from "gql/generated/types";
import { PROJECT_FILTERS } from "gql/queries";
import { ApolloMock } from "types/gql";

export const projectFiltersMock: ApolloMock<
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
        parsleyFilters: null,
      },
    },
  },
};
