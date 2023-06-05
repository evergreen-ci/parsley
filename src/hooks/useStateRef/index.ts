import { useRef, useState } from "react";

/**
 * A combination of useState and useRef,
 * returns the current state, a `setState` and a `getState` function.
 *
 * Use the `getState` function inside an event listener callbacks
 * in order to avoid referencing a stale state
 * @param initial - the initial value of the state
 * @returns [state, setState, getState]
 *
 * Reference: https://github.com/mongodb/leafygreen-ui/blob/main/packages/hooks/src/useStateRef.ts
 */
const useStateRef = <T extends any>(
  initial: T
): [T, (x: T) => void, () => T] => {
  const [state, _setState] = useState<T>(initial);
  const ref = useRef<T>(state);

  /**
   *
   * @param newVal - the new value to set the state to
   */
  function setState(newVal: T): void {
    _setState(newVal);
    ref.current = newVal;
  }

  /**
   * Returns the current value independent of the value of `state`
   * @returns the current value of the state
   */
  function getState(): T {
    return ref.current;
  }

  return [state, setState, getState];
};

export default useStateRef;
