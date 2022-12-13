import { useRef } from "react";
import styled from "@emotion/styled";
import Modal from "@leafygreen-ui/modal";
import { Body, H3, InlineKeyCode } from "@leafygreen-ui/typography";
import { CharKey, ModifierKey } from "constants/keys";
import { size, zIndex } from "constants/tokens";
import { useKeyboardShortcut, useOnClickOutside } from "hooks";

const shortcuts = [
  {
    keys: [
      ["CTRL", "F"],
      ["CMD", "F"],
    ],
    description: "Focus on the search input",
  },
  {
    keys: [
      ["CTRL", "S"],
      ["CMD", "S"],
    ],
    description: "Toggle between search, filter, and highlight",
  },
  { keys: [["]"]], description: "Toggle the side panel" },
  {
    keys: [["N"], ["ENTER"]],
    description: "Paginate forward to the next search result",
  },
  {
    keys: [["P"], ["SHIFT", "ENTER"]],
    description: "Paginate backwards to the previous search result",
  },
];

interface ShortcutModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ShortcutModal: React.FC<ShortcutModalProps> = ({ open, setOpen }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useKeyboardShortcut(
    { charKey: CharKey.QuestionMark, modifierKeys: [ModifierKey.Shift] },
    () => {
      setOpen(!open);
    }
  );

  useOnClickOutside([modalRef], () => {
    setOpen(false);
  });

  return (
    <StyledModal data-cy="shortcut-modal" open={open} setOpen={setOpen}>
      <div ref={modalRef}>
        <ModalTitle>
          <H3>Parsley Keyboard Shortcuts</H3>
        </ModalTitle>

        {shortcuts.map(({ keys, description }) => (
          <ModalRow key={description}>
            <ShortcutKeys>
              {keys.map((k, idx) => (
                <span key={k[0]}>
                  <KeyTuple keys={k} />
                  {idx + 1 !== keys.length && <Divider>{" / "}</Divider>}
                </span>
              ))}
            </ShortcutKeys>
            <Body>{description}</Body>
          </ModalRow>
        ))}
      </div>
    </StyledModal>
  );
};
interface KeyTupleProps {
  keys: string[];
}
const KeyTuple: React.FC<KeyTupleProps> = ({ keys }) => (
  <span>
    {keys.map((k, idx) => (
      <span key={`key_tuple_${k}`}>
        <InlineKeyCode>{k}</InlineKeyCode>
        {idx + 1 !== keys.length && <Divider>{" + "}</Divider>}
      </span>
    ))}
  </span>
);

// @ts-expect-error
const StyledModal = styled(Modal)`
  z-index: ${zIndex.modal};
`;

const ModalTitle = styled.div`
  margin-bottom: ${size.l};
`;

const ModalRow = styled.div`
  display: flex;
  margin: ${size.s} 0;
`;

const ShortcutKeys = styled.div`
  display: flex;
  margin-right: ${size.xs};
  width: 200px;
`;

const Divider = styled.span`
  margin: 0 ${size.xxs};
`;

export default ShortcutModal;
