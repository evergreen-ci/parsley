import { useEffect } from "react";
import { MockedProvider } from "@apollo/client/testing";
import styled from "@emotion/styled";
import { actions } from "@storybook/addon-actions";
import { StoryObj } from "@storybook/react";
import { userEvent } from "@storybook/testing-library";
import { useLogContext } from "context/LogContext";
import { useQueryParams } from "hooks/useQueryParam";
import { defaultFiltersMock } from "test_data/defaultFilters";
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
