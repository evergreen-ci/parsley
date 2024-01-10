import { RefObject, useEffect } from "react";

const useOnClickOutside = (
  refs: Array<RefObject<HTMLElement>>,
  cb: () => void,
): void => {
  useEffect(() => {
    /**
     * `handleClickOutside` executes the callback if a mouse click is detected outside of the target elements.
     * @param event - the event that is being listened to
     */
    function handleClickOutside(event: MouseEvent): void {
      const isNotFocused = refs.every(
        (ref) => ref.current && !ref.current.contains(event.target as Node),
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
