import { useCallback, useEffect, useRef } from "react";

type UseKeyboardShortcutOptions = {
  preventDefault?: boolean;
  overrideIgnore?: boolean;
};

// Used to prevent shortcuts from being activated on input elements.
const INPUT_ELEMENTS = ["INPUT", "TEXTAREA", "SELECT"];

const useKeyboardShortcut = (
  shortcutKeys: string[],
  cb: () => void,
  disabled: boolean = false,
  options: UseKeyboardShortcutOptions = {}
) => {
  // We wrap the callback to prevent triggering unnecessary useEffect.
  const cbRef = useRef(cb);
  cbRef.current = cb;

  const isShortcutPressed = useCallback(
    (event: KeyboardEvent) => {
      if (
        shortcutKeys.includes("Control") &&
        !event.ctrlKey &&
        !event.metaKey
      ) {
        return false;
      }
      if (shortcutKeys.includes("Alt") && !event.altKey) return false;
      if (shortcutKeys.includes("Shift") && !event.shiftKey) return false;

      return shortcutKeys[shortcutKeys.length - 1] === event.key;
    },
    [shortcutKeys]
  );

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      const { preventDefault = true, overrideIgnore = false } = options;

      const shortcutPressed = isShortcutPressed(event);
      const shouldExecute =
        overrideIgnore ||
        !INPUT_ELEMENTS.includes((event.target as HTMLElement).tagName);

      if (shortcutPressed) {
        // Prevent browser default behavior.
        if (preventDefault) {
          event.preventDefault();
        }
        if (shouldExecute) {
          cbRef.current();
        }
      }
    },
    [isShortcutPressed, options]
  );

  useEffect(() => {
    // There's no need to keep track of events if the component is disabled.
    if (disabled) {
      document.removeEventListener("keydown", handleKeydown);
    } else {
      document.addEventListener("keydown", handleKeydown);
    }

    return (): void => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown, disabled]);
};

export default useKeyboardShortcut;
