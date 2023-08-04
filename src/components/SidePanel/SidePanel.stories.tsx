import { useEffect } from "react";
import { MockedProvider } from "@apollo/client/testing";
import styled from "@emotion/styled";
import { actions } from "@storybook/addon-actions";
import { userEvent } from "@storybook/testing-library";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { useQueryParams } from "hooks/useQueryParam";
import { projectFiltersMock } from "test_data/projectFilters";
import { evergreenTaskMock } from "test_data/task";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import SidePanel from ".";

export default {
  component: SidePanel,
  decorators: [
    (Story: () => JSX.Element) => (
      <MockedProvider mocks={[projectFiltersMock, evergreenTaskMock]}>
        <Story />
      </MockedProvider>
    ),
  ],
} satisfies CustomMeta<typeof SidePanel>;

const Story = ({ ...args }) => {
  const [, setSearchParams] = useQueryParams();
  const { setLogMetadata } = useLogContext();

  useEffect(() => {
    setSearchParams({
      filters: ["100active%20filter"],
      highlights: ["highlight", "highlight2"],
    });
    setLogMetadata({
      execution: "0",
      logType: LogTypes.EVERGREEN_TASK_LOGS,
      taskID:
        "spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35",
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
export const Default: CustomStoryObj<typeof SidePanel> = {
  play: () => {
    userEvent.keyboard("[[");
  },
  render: (args) => <Story {...args} />,
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 600px;
`;
