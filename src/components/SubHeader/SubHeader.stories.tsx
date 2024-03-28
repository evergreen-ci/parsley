import { useEffect } from "react";
import { MockedProvider } from "@apollo/client/testing";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { LogMetadata } from "context/LogContext/types";
import { evergreenTaskMock, logkeeperMetadataMock } from "test_data/task";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import Subheader from ".";

export default {
  component: Subheader,
  decorators: [
    (Story: () => JSX.Element) => (
      <MockedProvider mocks={[evergreenTaskMock, logkeeperMetadataMock]}>
        <Story />
      </MockedProvider>
    ),
  ],
} satisfies CustomMeta<typeof Subheader>;

export const UploadedLog: CustomStoryObj<typeof SubheaderWrapper> = {
  argTypes: {},
  args: {
    fileName: "some-file-name.log",
    isUploadedLog: true,
  },
  render: (args) => <SubheaderWrapper {...args} />,
};

export const TaskLog: CustomStoryObj<typeof SubheaderWrapper> = {
  argTypes: {},
  args: {
    execution: "0",
    isUploadedLog: false,
    logType: LogTypes.EVERGREEN_TASK_LOGS,
    taskID:
      "spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35",
  },
  render: (args) => <SubheaderWrapper {...args} />,
};

export const TestLog: CustomStoryObj<typeof SubheaderWrapper> = {
  argTypes: {},
  args: {
    execution: "0",
    isUploadedLog: false,
    logType: LogTypes.EVERGREEN_TEST_LOGS,
    taskID:
      "spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35",
    testID: "JustAFakeTestInALonelyWorld",
  },
  render: (args) => <SubheaderWrapper {...args} />,
};

export const TaskFileLog: CustomStoryObj<typeof SubheaderWrapper> = {
  argTypes: {},
  args: {
    execution: "0",
    fileName: "some-file-name.log",
    isUploadedLog: false,
    logType: LogTypes.EVERGREEN_TEST_LOGS,
    taskID:
      "spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35",
  },
  render: (args) => <SubheaderWrapper {...args} />,
};
interface SubheaderWrapperProps
  extends LogMetadata,
    React.ComponentProps<typeof Subheader> {
  isUploadedLog: boolean;
}

const SubheaderWrapper: React.FC<SubheaderWrapperProps> = ({
  isUploadedLog,
  ...metaData
}) => {
  const { setLogMetadata } = useLogContext();

  useEffect(() => {
    setLogMetadata({ ...metaData, logType: LogTypes.LOCAL_UPLOAD });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Subheader />;
};
