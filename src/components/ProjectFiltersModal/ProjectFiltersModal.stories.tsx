import { useEffect, useState } from "react";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { useQueryParams } from "hooks/useQueryParam";
import { noFiltersMock, projectFiltersMock } from "test_data/projectFilters";
import { evergreenTaskMock } from "test_data/task";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import ProjectFiltersModal from ".";

export default {
  component: ProjectFiltersModal,
} satisfies CustomMeta<typeof ProjectFiltersModal>;

const Component = ({ ...args }) => {
  const [, setSearchParams] = useQueryParams();
  const { setLogMetadata } = useLogContext();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSearchParams({ filters: ["100active%20filter"] });
    setLogMetadata({
      execution: "0",
      logType: LogTypes.EVERGREEN_TASK_LOGS,
      taskID:
        "spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <button onClick={() => setOpen(true)} type="button">
        Open modal
      </button>
      <ProjectFiltersModal {...args} open={open} setOpen={setOpen} />
    </>
  );
};

export const Default: CustomStoryObj<typeof ProjectFiltersModal> = {
  parameters: {
    apolloClient: {
      mocks: [projectFiltersMock, evergreenTaskMock],
    },
  },
  render: (args) => <Component {...args} />,
};

export const Empty: CustomStoryObj<typeof ProjectFiltersModal> = {
  parameters: {
    apolloClient: {
      mocks: [noFiltersMock, evergreenTaskMock],
    },
  },
  render: (args) => <Component {...args} />,
};
