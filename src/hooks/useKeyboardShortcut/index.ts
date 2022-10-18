import { useCallback, useEffect, useRef } from "react";
import { CharKey, ModifierKey } from "constants/keys";
import { arraySymmetricDifference } from "utils/array";

type ShortcutKeys = {
  modifierKeys?: ModifierKey[];
  charKey: CharKey;
};

type UseKeyboardShortcutOptions = {
  disabled?: boolean;
  preventDefault?: boolean;
  overrideIgnore?: boolean;
};

// Used to prevent shortcuts from being activated on input elements.
const INPUT_ELEMENTS = ["INPUT", "TEXTAREA", "SELECT"];

const useKeyboardShortcut = (
  keys: ShortcutKeys,
  cb: () => void,
  options: UseKeyboardShortcutOptions = {}
) => {
  if (!keys.modifierKeys?.length && !keys.charKey) {
    throw new Error("Must provide at least one key.");
  }

  // We wrap the callback to prevent triggering unnecessary useEffect.
  const cbRef = useRef(cb);
  cbRef.current = cb;

  const {
    disabled = false,
    preventDefault = true,
    overrideIgnore = false,
  } = options;

  const areExactModifierKeysPressed = (
    event: KeyboardEvent,
    modifierKeys: ModifierKey[]
  ): boolean => {
    const pressedModifierKeys: ModifierKey[] = [
      ...(event.ctrlKey || event.metaKey ? [ModifierKey.Control] : []),
      ...(event.altKey ? [ModifierKey.Alt] : []),
      ...(event.shiftKey ? [ModifierKey.Shift] : []),
    ];
    return (
      arraySymmetricDifference(pressedModifierKeys, modifierKeys).length === 0
    );
  };

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      const exactModifierKeysPressed = areExactModifierKeysPressed(
        event,
        keys.modifierKeys ?? []
      );
      const charKeyPressed = event.key === keys.charKey;

      const shouldExecute =
        overrideIgnore ||
        !INPUT_ELEMENTS.includes((event.target as HTMLElement).tagName);

      if (exactModifierKeysPressed && charKeyPressed) {
        if (shouldExecute) {
          // Prevent browser default behavior.
          if (preventDefault) {
            event.preventDefault();
          }
          cbRef.current();
        }
      }
    },
    [keys, preventDefault, overrideIgnore]
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