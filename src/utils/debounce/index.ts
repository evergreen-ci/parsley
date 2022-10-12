/**
 * The `debounce()` function forces a function to wait a certain amount of time before running again.
 * @param fn
 * @param delay
 * @returns
 */
const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

export default debounce;
