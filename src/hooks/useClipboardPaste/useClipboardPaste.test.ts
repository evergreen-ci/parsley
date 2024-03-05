import { renderHook } from "test_utils";
import useClipboardPaste from "."; // Adjust the import path as necessary

// Mock navigator.clipboard.readText
const mockReadText = jest.fn();

describe("useClipboardPaste", () => {
  beforeAll(() => {
    // Define a global.navigator.clipboard object if it doesn't exist
    Object.assign(navigator, {
      clipboard: {
        readText: mockReadText,
      },
    });
  });

  beforeEach(() => {
    // Clear mock history before each test
    mockReadText.mockClear();
  });
  it("calls the callback with pasted text on paste event", async () => {
    const callback = jest.fn();
    renderHook(() => useClipboardPaste(callback));

    // Setup the mocked readText function to return a specific string
    const expectedText = "Pasted content";
    mockReadText.mockResolvedValue(expectedText);

    // Simulate a paste event
    const event = new Event("paste");
    window.dispatchEvent(event);

    // Wait for the promise to resolve
    await new Promise(process.nextTick);

    // Check if the callback was called with the expected text
    expect(callback).toHaveBeenCalledWith(expectedText);
  });

  it("removes the paste event listener on unmount", () => {
    const callback = jest.fn();
    const { unmount } = renderHook(() => useClipboardPaste(callback));

    unmount();

    // Simulate a paste event after unmounting
    const event = new Event("paste");
    window.dispatchEvent(event);

    // Since the component is unmounted, callback should not be called
    expect(callback).not.toHaveBeenCalled();
  });
});
