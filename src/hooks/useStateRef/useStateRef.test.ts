import { act, renderHook } from "@testing-library/react";
import useStateRef from ".";

describe("useStateRef", () => {
  it("should return the current state, a setState and a getState function", () => {
    const { result } = renderHook(() => useStateRef(0));
    const [state, setState, getState] = result.current;
    expect(state).toBe(0);
    expect(setState).toBeInstanceOf(Function);
    expect(getState).toBeInstanceOf(Function);
  });
  it("should update the state and the ref", () => {
    const { result } = renderHook(() => useStateRef(0));
    let [state, setState, getState] = result.current;
    expect(state).toBe(0);
    expect(getState()).toBe(0);
    act(() => {
      setState(1);
    });
    [state, setState, getState] = result.current;
    expect(state).toBe(1);
    expect(getState()).toBe(1);
  });
  it("getState should return the most up to date state even if we have a stale copy of state", () => {
    const { result } = renderHook(() => useStateRef(0));
    const [state, setState, getState] = result.current;
    act(() => {
      setState(1);
    });
    expect(state).toBe(0);
    expect(getState()).toBe(1);
  });
});
