import { useEffect } from "react";
import { MockedProvider } from "@apollo/client/testing";
import Card from "@leafygreen-ui/card";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { parsleySettingsMock } from "test_data/parsleySettings";
import WithToastContext from "test_utils/toast-decorator";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import DetailsMenu from ".";

export default {
  component: DetailsMenu,
  decorators: [
    (Story: () => JSX.Element) => (
      <MockedProvider mocks={[parsleySettingsMock]}>
        <Story />
      </MockedProvider>
    ),
    WithToastContext,
  ],
} satisfies CustomMeta<typeof DetailsMenu>;

export const Default: CustomStoryObj<typeof DetailsMenu> = {
  render: (args) => (
    <Card style={{ maxWidth: 750 }}>
      <DetailsMenu {...args} />
    </Card>
  ),
};

const DetailsMenuWithDownloadedLog = (args: any) => {
  const { setLogMetadata } = useLogContext();
  useEffect(() => {
    setLogMetadata({
      execution: "0",
      logType: LogTypes.EVERGREEN_TEST_LOGS,
      taskID:
        "mci_ubuntu1604_test_model_task_5f4d3b4f562343215f7f5f3d_20_08_25_15_50_10",
      testID: "TestModelGetArtifacts",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Card style={{ maxWidth: 750 }}>
      <DetailsMenu {...args} />
    </Card>
  );
};

export const WithDownloadedLog: CustomStoryObj<typeof DetailsMenu> = {
  render: DetailsMenuWithDownloadedLog,
};
