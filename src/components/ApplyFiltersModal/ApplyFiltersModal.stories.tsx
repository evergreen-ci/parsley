import { useEffect, useState } from "react";
import { MockedProvider } from "@apollo/client/testing";
import { StoryObj } from "@storybook/react";
import { useLogContext } from "context/LogContext";
import { useQueryParams } from "hooks/useQueryParam";
import { defaultFiltersMock, noFiltersMock } from "test_data/defaultFilters";
import ApplyFiltersModal from ".";

export default {
  component: ApplyFiltersModal,
};

const Component = ({ ...args }) => {
  const { setTaskMetadata } = useLogContext();
  const [, setSearchParams] = useQueryParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTaskMetadata({ projectIdentifier: "evergreen" });
    setSearchParams({ filters: ["100active%20filter"] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <button onClick={() => setOpen(true)} type="button">
        Open modal
      </button>
      <ApplyFiltersModal {...args} open={open} setOpen={setOpen} />
    </>
  );
};

export const Default: StoryObj<typeof ApplyFiltersModal> = {
  render: (args) => <Component {...args} />,
  decorators: [
    (Story: () => JSX.Element) => (
      <MockedProvider mocks={[defaultFiltersMock]}>
        <Story />
      </MockedProvider>
    ),
  ],
};

export const Empty: StoryObj<typeof ApplyFiltersModal> = {
  render: (args) => <Component {...args} />,
  decorators: [
    (Story: () => JSX.Element) => (
      <MockedProvider mocks={[noFiltersMock]}>
        <Story />
      </MockedProvider>
    ),
  ],
};
