import { useState } from "react";
import { render, screen, userEvent, waitFor } from "test_utils";
import ShortcutModal from ".";

const ModalWrapper = () => {
  const [open, setOpen] = useState(false);
  return <ShortcutModal open={open} setOpen={setOpen} />;
};

describe("shortcutModal", () => {
  it("should toggle open when user executes keyboard shortcut", async () => {
    const user = userEvent.setup();
    render(<ModalWrapper />);
    expect(screen.queryByDataCy("shortcut-modal")).toBeNull();

    await user.keyboard("{Shift>}{?}{/Shift}");
    await waitFor(() => {
      expect(screen.getByDataCy("shortcut-modal")).toBeVisible();
    });
  });

  it("should close when the user clicks outside of the modal", async () => {
    const user = userEvent.setup();
    render(<ModalWrapper />);
    expect(screen.queryByDataCy("shortcut-modal")).toBeNull();

    await user.keyboard("{Shift>}{?}{/Shift}");
    await waitFor(() => {
      expect(screen.getByDataCy("shortcut-modal")).toBeVisible();
    });

    await user.click(document.body as HTMLElement);
    await waitFor(() => {
      expect(screen.queryByDataCy("shortcut-modal")).toBeNull();
    });
  });
});
