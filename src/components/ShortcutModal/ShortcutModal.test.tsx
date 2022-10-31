import { render, screen, userEvent, waitFor } from "test_utils";
import ShortcutModal from ".";

describe("shortcutModal", () => {
  const user = userEvent.setup();

  it("should open when the user presses the question mark", async () => {
    render(<ShortcutModal />);

    expect(screen.queryByDataCy("shortcut-modal")).toBeNull();
    await user.keyboard("{Shift>}{?}{/Shift}");
    await waitFor(() => {
      expect(screen.getByDataCy("shortcut-modal")).toBeVisible();
    });
  });

  it("should close when the user clicks outside of the modal", async () => {
    render(<ShortcutModal />);

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
