import { useState } from "react";
import { StoryObj } from "@storybook/react";
import ShortcutModal from ".";

export default {
  component: ShortcutModal,
};

export const Default: StoryObj<typeof ShortcutModal> = {
  render: (args) => <Component {...args} />,
  args: {},
};

const Component = (args: any) => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <button onClick={() => setOpen(true)} type="button">
        Open Modal
      </button>
      <ShortcutModal {...args} open={open} setOpen={setOpen} />
    </>
  );
};
