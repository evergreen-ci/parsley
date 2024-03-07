import { useCallback, useEffect } from "react";

/**
 * `useClipboardPaste` listens for a paste event and calls a callback with the pasted text.
 * @param callback - a function that takes a string as an argument
 */
const useClipboardPaste = (callback: (text: string) => void): void => {
  const handlePaste = useCallback(
    (event: ClipboardEvent) => {
      navigator.clipboard.readText().then(callback);
      event.preventDefault();
    },
    [callback],
  );

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [handlePaste]);
};

export default useClipboardPaste;
