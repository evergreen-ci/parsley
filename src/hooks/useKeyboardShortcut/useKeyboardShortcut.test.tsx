import { renderHook } from "@testing-library/react-hooks";
import { CharKey, ModifierKey } from "constants/keys";
import { render, screen, userEvent } from "test_utils";
import useKeyboardShortcut from ".";

describe("useKeyboardShortcut", () => {
  const user = userEvent.setup();

  describe("multiple keys", () => {
    it("should call the callback only when the exact shortcut keys are pressed", async () => {
      const callback = jest.fn();
      renderHook(() =>
        useKeyboardShortcut([ModifierKey.Control, CharKey.A], callback)
      );
      await user.keyboard("{Control}");
      expect(callback).toHaveBeenCalledTimes(0);
      await user.keyboard("{a}");
      expect(callback).toHaveBeenCalledTimes(0);
      await user.keyboard("{Control>}{Shift>}{a}{/Control}{/Shift}");
      expect(callback).toHaveBeenCalledTimes(0);
      await user.keyboard("{Control>}{a}{/Control}");
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should not call the callback if an input element has focus", async () => {
      const callback = jest.fn();
      renderHook(() =>
        useKeyboardShortcut([ModifierKey.Control, CharKey.A], callback)
      );
      render(<input data-cy="test-input" />);

      await user.click(screen.getByDataCy("test-input"));
      expect(screen.getByDataCy("test-input")).toHaveFocus();
      await user.keyboard("{Control>}{a}{/Control}");
      expect(callback).toHaveBeenCalledTimes(0);
      expect(screen.getByDataCy("test-input")).toHaveValue("");
    });
  });

  describe("single key", () => {
    it("should call the callback only when the exact shortcut key is pressed", async () => {
      const callback = jest.fn();
      renderHook(() => useKeyboardShortcut(CharKey.A, callback));
      await user.keyboard("{Control>}{A}{/Control}");
      expect(callback).toHaveBeenCalledTimes(0);
      await user.keyboard("{Control>}{Shift>}{a}{/Control}{/Shift}");
      expect(callback).toHaveBeenCalledTimes(0);
      await user.keyboard("{a}");
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should not call the callback if an input element has focus", async () => {
      const callback = jest.fn();
      renderHook(() => useKeyboardShortcut(CharKey.A, callback));
      render(<input data-cy="test-input" />);

      await user.click(screen.getByDataCy("test-input"));
      expect(screen.getByDataCy("test-input")).toHaveFocus();
      await user.keyboard("{a}");
      expect(callback).toHaveBeenCalledTimes(0);
      expect(screen.getByDataCy("test-input")).toHaveValue("a");
    });
  });

  it("should call the callback if an input element has focus and overrideIgnore is enabled", async () => {
    const callback = jest.fn();
    renderHook(() =>
      useKeyboardShortcut([ModifierKey.Control, CharKey.A], callback, {
        overrideIgnore: true,
      })
    );
    render(<input data-cy="test-input" />);
    await user.click(screen.getByDataCy("test-input"));
    expect(screen.getByDataCy("test-input")).toHaveFocus();
    await user.keyboard("{Control>}{a}{/Control}");
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not call the callback if the component is disabled", async () => {
    const callback = jest.fn();
    renderHook(() =>
      useKeyboardShortcut([ModifierKey.Control, CharKey.A], callback, {
        disabled: true,
      })
    );
    await user.keyboard("{a}");
    expect(callback).toHaveBeenCalledTimes(0);
  });

  it("should remove the event listener if the component is initially enabled, then disabled", async () => {
    const mockedAddEventListener = jest.fn();
    const mockedRemoveEventListener = jest.fn();
    jest
      .spyOn(document, "addEventListener")
      .mockImplementation(mockedAddEventListener);
    jest
      .spyOn(document, "removeEventListener")
      .mockImplementation(mockedRemoveEventListener);

    const { rerender: rerenderHook } = renderHook(
      (args: { disabled: boolean } = { disabled: false }) =>
        useKeyboardShortcut([CharKey.A], jest.fn(), { disabled: args.disabled })
    );
    expect(mockedAddEventListener).toHaveBeenCalledTimes(1);

    rerenderHook({ disabled: true });
    expect(mockedAddEventListener).toHaveBeenCalledTimes(1);
    expect(mockedRemoveEventListener).toHaveBeenCalledTimes(2);
  });
});
