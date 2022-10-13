import { useCallback, useEffect, useRef } from "react";
import { CharKey, ModifierKey } from "constants/keys";

type UseKeyboardShortcutOptions = {
  disabled?: boolean;
  preventDefault?: boolean;
  overrideIgnore?: boolean;
};

// Used to prevent shortcuts from being activated on input elements.
const INPUT_ELEMENTS = ["INPUT", "TEXTAREA", "SELECT"];

const useKeyboardShortcut = (
  shortcutKeys: (ModifierKey | CharKey)[] | CharKey,
  cb: () => void,
  options: UseKeyboardShortcutOptions = {}
) => {
  // We wrap the callback to prevent triggering unnecessary useEffect.
  const cbRef = useRef(cb);
  cbRef.current = cb;

  const {
    disabled = false,
    preventDefault = true,
    overrideIgnore = false,
  } = options;

  const isShortcutPressed = useCallback(
    (event: KeyboardEvent) => {
      if (typeof shortcutKeys === "string") {
        return (
          shortcutKeys === event.key &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey
        );
      }

      const shouldControl = shortcutKeys.includes(ModifierKey.Control);
      if (shouldControl && !event.ctrlKey && !event.metaKey) return false;
      if (!shouldControl && (event.ctrlKey || event.metaKey)) return false;

      const shouldAlt = shortcutKeys.includes(ModifierKey.Alt);
      if (shouldAlt && !event.altKey) return false;
      if (!shouldAlt && event.altKey) return false;

      const shouldShift = shortcutKeys.includes(ModifierKey.Shift);
      if (shouldShift && !event.shiftKey) return false;
      if (!shouldShift && event.shiftKey) return false;

      return shortcutKeys[shortcutKeys.length - 1] === event.key;
    },
    [shortcutKeys]
  );

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      const shortcutPressed = isShortcutPressed(event);
      const shouldExecute =
        overrideIgnore ||
        !INPUT_ELEMENTS.includes((event.target as HTMLElement).tagName);

      if (shortcutPressed) {
        if (shouldExecute) {
          // Prevent browser default behavior.
          if (preventDefault) {
            event.preventDefault();
          }
          cbRef.current();
        }
      }
    },
    [isShortcutPressed, preventDefault, overrideIgnore]
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
