import { useEffect } from "react";
import { MockedProvider } from "@apollo/client/testing";
import styled from "@emotion/styled";
import { actions } from "@storybook/addon-actions";
import { StoryObj } from "@storybook/react";
import { userEvent } from "@storybook/testing-library";
import { useLogContext } from "context/LogContext";
import {
  DefaultFiltersForProjectQuery,
  DefaultFiltersForProjectQueryVariables,
} from "gql/generated/types";
import { DEFAULT_FILTERS_FOR_PROJECT } from "gql/queries";
import { useQueryParams } from "hooks/useQueryParam";
import { ApolloMock } from "types/gql";
import SidePanel from ".";

export default {
  component: SidePanel,
  decorators: [
    (Story: () => JSX.Element) => (
      <MockedProvider mocks={[defaultFiltersMock]}>
        <Story />
      </MockedProvider>
    ),
  ],
};
const Story = ({ ...args }) => {
  const { setTaskMetadata } = useLogContext();
  const [, setSearchParams] = useQueryParams();

  useEffect(() => {
    setTaskMetadata({ projectIdentifier: "evergreen" });
    setSearchParams({
      highlights: ["highlight", "highlight2"],
      filters: ["100active%20filter"],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const clearExpandedLines = () => actions("clearExpandedLines");
  const collapseLines = () => actions("collapseLines");
  return (
    <Container>
      <SidePanel
        {...args}
        clearExpandedLines={clearExpandedLines}
        collapseLines={collapseLines}
        expandedLines={[[1, 10]]}
      />
    </Container>
  );
};
export const Default: StoryObj<typeof SidePanel> = {
  render: (args) => <Story {...args} />,
  play: () => {
    userEvent.keyboard("[[");
  },
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 600px;
`;

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
            expression: "my filter",
          },
        ],
      },
    },
  },
};
