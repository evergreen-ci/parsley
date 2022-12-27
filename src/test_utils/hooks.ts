import { DependencyList, EffectCallback, useEffect, useRef } from "react";

/**
 * `usePrevious` is a custom hook that returns the previous value of a given value
 * @param value
 * @param initialValue
 * @returns
 */
const usePrevious = <T>(value: T, initialValue: T) => {
  const ref = useRef(initialValue);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

/**
 * `useEffectDebugger` is a custom hook that logs the changed dependencies of a useEffect hook
 *
 * @param effectHook - the effect hook
 * @param dependencies - an array of dependencies
 * @param dependencyNames - an array of strings that correspond to the dependencies
 */
const useEffectDebugger = (
  effectHook: EffectCallback,
  dependencies: DependencyList,
  dependencyNames: string[] = []
) => {
  if (process.env.NODE_ENV !== "development") {
    console.warn(
      "[use-effect-debugger] This hook should only be used in development!"
    );
  }
  const previousDeps = usePrevious(dependencies, []);

  const changedDeps = dependencies.reduce(
    (accum: Record<string, { before: any; after: any }>, dependency, index) => {
      if (dependency !== previousDeps[index]) {
        const keyName = dependencyNames[index] || index;
        return {
          ...accum,
          [keyName]: {
            before: previousDeps[index],
            after: dependency,
          },
        };
      }

      return accum;
    },
    {} as Record<string, { before: any; after: any }>
  );

  if (Object.keys(changedDeps).length) {
    console.log("[use-effect-debugger] ");
    console.table(changedDeps);
  }

  useEffect(effectHook, dependencies);
};

export { useEffectDebugger };
