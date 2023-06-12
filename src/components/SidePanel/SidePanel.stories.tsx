import { useEffect } from "react";
import { MockedProvider } from "@apollo/client/testing";
import styled from "@emotion/styled";
import { actions } from "@storybook/addon-actions";
import { StoryObj } from "@storybook/react";
import { userEvent } from "@storybook/testing-library";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { useQueryParams } from "hooks/useQueryParam";
import { defaultFiltersMock } from "test_data/defaultFilters";
import { evergreenTaskMock } from "test_data/task";
import SidePanel from ".";

export default {
  component: SidePanel,
  decorators: [
    (Story: () => JSX.Element) => (
      <MockedProvider mocks={[defaultFiltersMock, evergreenTaskMock]}>
        <Story />
      </MockedProvider>
    ),
  ],
};

const Story = ({ ...args }) => {
  const [, setSearchParams] = useQueryParams();
  const { setLogMetadata } = useLogContext();

  useEffect(() => {
    setSearchParams({
      highlights: ["highlight", "highlight2"],
      filters: ["100active%20filter"],
    });
    setLogMetadata({
      taskID:
        "spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35",
      execution: "0",
      logType: LogTypes.EVERGREEN_TASK_LOGS,
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
