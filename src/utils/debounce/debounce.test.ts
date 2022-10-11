import debounce from ".";

jest.useFakeTimers();
describe("debounce", () => {
  it("should debounce the function", () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 100);
    debouncedFn();
    expect(fn).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(fn).toHaveBeenCalledWith();
  });
});
