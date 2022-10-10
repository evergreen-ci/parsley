import { renderHook } from "@testing-library/react-hooks";
import { render, screen, userEvent } from "test_utils";
import useKeyboardShortcut from ".";

describe("useKeyboardShortcut", () => {
  const user = userEvent.setup();

  it("should call the callback when the specified shortcut keys are pressed", async () => {
    const callback = jest.fn();
    renderHook(() => useKeyboardShortcut(["Control", "a"], callback));

    await user.keyboard("{Control}");
    expect(callback).toHaveBeenCalledTimes(0);
    await user.keyboard("{a}");
    expect(callback).toHaveBeenCalledTimes(0);
    await user.keyboard("{Control>}{a}");
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not call the callback if an input element has focus", async () => {
    const callback = jest.fn();
    renderHook(() => useKeyboardShortcut(["Control", "a"], callback));
    render(<input data-cy="test-input" />);

    await user.click(screen.getByDataCy("test-input"));
    expect(screen.getByDataCy("test-input")).toHaveFocus();
    await user.keyboard("{Control>}{a}");
    expect(callback).toHaveBeenCalledTimes(0);
  });

  it("should call the callback if an input element has focus and overrideIgnore is enabled", async () => {
    const callback = jest.fn();
    renderHook(() =>
      useKeyboardShortcut(["Control", "a"], callback, false, {
        overrideIgnore: true,
      })
    );
    render(<input data-cy="test-input" />);

    await user.click(screen.getByDataCy("test-input"));
    expect(screen.getByDataCy("test-input")).toHaveFocus();
    await user.keyboard("{Control>}{a}");
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not call the callback if the component is disabled", async () => {
    const callback = jest.fn();
    const disabled = true;
    renderHook(() => useKeyboardShortcut(["Control", "a"], callback, disabled));
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
        useKeyboardShortcut(["a"], jest.fn(), args.disabled)
    );
    expect(mockedAddEventListener).toHaveBeenCalledTimes(1);

    rerenderHook({ disabled: true });
    expect(mockedAddEventListener).toHaveBeenCalledTimes(1);
    expect(mockedRemoveEventListener).toHaveBeenCalledTimes(2);
  });
});
