import { useState } from "react";
import { render, screen, userEvent, waitFor } from "test_utils";
import ShortcutModal from ".";

const ModalWrapper = () => {
  const [open, setOpen] = useState(false);
  return <ShortcutModal open={open} setOpen={setOpen} />;
};

describe("shortcutModal", () => {
  const user = userEvent.setup();

  it("should toggle open and closed when the user presses the question mark", async () => {
    render(<ModalWrapper />);
    expect(screen.queryByDataCy("shortcut-modal")).toBeNull();

    await user.keyboard("{Shift>}{?}{/Shift}");
    await waitFor(() => {
      expect(screen.getByDataCy("shortcut-modal")).toBeVisible();
    });

    await user.keyboard("{Shift>}{?}{/Shift}");
    await waitFor(() => {
      expect(screen.queryByDataCy("shortcut-modal")).toBeNull();
    });
  });

  it("should close when the user clicks outside of the modal", async () => {
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
