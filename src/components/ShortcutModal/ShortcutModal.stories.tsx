import { useState } from "react";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import ShortcutModal from ".";

export default {
  component: ShortcutModal,
} satisfies CustomMeta<typeof ShortcutModal>;

export const Default: CustomStoryObj<typeof ShortcutModal> = {
  args: {},
  render: (args) => <Component {...args} />,
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
