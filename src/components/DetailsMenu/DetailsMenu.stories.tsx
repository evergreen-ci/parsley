import { useEffect } from "react";
import Card from "@leafygreen-ui/card";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import DetailsMenu from ".";

export default {
  component: DetailsMenu,
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
      taskID:
        "mci_ubuntu1604_test_model_task_5f4d3b4f562343215f7f5f3d_20_08_25_15_50_10",
      execution: "0",
      testID: "TestModelGetArtifacts",
      logType: LogTypes.EVERGREEN_TEST_LOGS,
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
