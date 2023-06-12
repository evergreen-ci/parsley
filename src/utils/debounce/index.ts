/**
 * The `debounce()` function forces a function to wait a certain amount of time before running again.
 * @param fn - The function to be debounced
 * @param delay - The amount of time to wait before running the function again
 * @returns The debounced function
 */
const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

export default debounce;
