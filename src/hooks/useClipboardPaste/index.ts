import { useCallback, useEffect } from "react";

/**
 * `useClipboardPaste` is a custom hook that listens for a paste event and calls a callback with the pasted text.
 * @param callback - a function that takes a string as an argument
 */
const useClipboardPaste = (callback: (text: string) => void): void => {
  const pasteListener = useCallback(
    (event: ClipboardEvent) => {
      navigator.clipboard.readText().then(callback);
      event.preventDefault();
    },
    [callback],
  );

  useEffect(() => {
    window.addEventListener("paste", pasteListener);
    return () => {
      window.removeEventListener("paste", pasteListener);
    };
  }, [pasteListener]);
};

export default useClipboardPaste;
