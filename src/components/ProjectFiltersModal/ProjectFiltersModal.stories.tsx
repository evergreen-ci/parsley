import { useEffect, useState } from "react";
import { MockedProvider } from "@apollo/client/testing";
import { StoryObj } from "@storybook/react";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { useQueryParams } from "hooks/useQueryParam";
import { noFiltersMock, projectFiltersMock } from "test_data/projectFilters";
import { evergreenTaskMock } from "test_data/task";
import ProjectFiltersModal from ".";

export default {
  component: ProjectFiltersModal,
};

const Component = ({ ...args }) => {
  const [, setSearchParams] = useQueryParams();
  const { setLogMetadata } = useLogContext();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSearchParams({ filters: ["100active%20filter"] });
    setLogMetadata({
      taskID:
        "spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35",
      execution: "0",
      logType: LogTypes.EVERGREEN_TASK_LOGS,
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

export const Default: StoryObj<typeof ProjectFiltersModal> = {
  render: (args) => <Component {...args} />,
  decorators: [
    (Story: () => JSX.Element) => (
      <MockedProvider mocks={[projectFiltersMock, evergreenTaskMock]}>
        <Story />
      </MockedProvider>
    ),
  ],
};

export const Empty: StoryObj<typeof ProjectFiltersModal> = {
  render: (args) => <Component {...args} />,
  decorators: [
    (Story: () => JSX.Element) => (
      <MockedProvider mocks={[noFiltersMock, evergreenTaskMock]}>
        <Story />
      </MockedProvider>
    ),
  ],
};
