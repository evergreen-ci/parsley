import { renderHook } from "test_utils";
import usePrevious from ".";

describe("usePrevious", () => {
  it("should initially be undefined", () => {
    const { result } = renderHook(() => usePrevious(0));
    expect(result.current).toBeUndefined();
  });
  it("should maintain the previous value of the state", () => {
    const { rerender, result } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 0 },
    });

    expect(result.current).toBeUndefined();

    rerender({ value: 1 });
    expect(result.current).toBe(0);

    rerender({ value: 2 });
    expect(result.current).toBe(1);

    rerender({ value: 2 });
    expect(result.current).toBe(2);
  });
});
