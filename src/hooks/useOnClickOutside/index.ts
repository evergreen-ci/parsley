import { RefObject, useEffect } from "react";

const useOnClickOutside = (
  refs: Array<RefObject<HTMLElement>>,
  cb: () => void
): void => {
  useEffect(() => {
    function handleClickOutside(event: any): void {
      const isNotFocused = refs.every(
        (ref) => ref.current && !ref.current.contains(event.target as Node)
      );
      // if none of the refs are being focused on, execute callback
      if (isNotFocused) {
        cb();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return (): void => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cb, refs]);
};

export default useOnClickOutside;
