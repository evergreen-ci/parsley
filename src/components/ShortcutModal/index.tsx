import { useRef, useState } from "react";
import styled from "@emotion/styled";
import Modal from "@leafygreen-ui/modal";
import { Body, H3, InlineKeyCode } from "@leafygreen-ui/typography";
import { CharKey, ModifierKey } from "constants/keys";
import { size, zIndex } from "constants/tokens";
import { useKeyboardShortcut, useOnClickOutside } from "hooks";

const shortcuts = [
  { keys: ["CTRL/CMD", "F"], description: "Focus on the search input" },
  {
    keys: ["CTRL/CMD", "S"],
    description: "Toggle between search, filter, and highlight",
  },
  { keys: ["]"], description: "Toggle the filter panel" },
  {
    keys: ["N/ENTER"],
    description: "Paginate forward to the next search result",
  },
  {
    keys: ["P"],
    description: "Paginate backwards to the previous search result",
  },
];

const ShortcutModal: React.FC = () => {
  const [open, setOpen] = useState(false);
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
                <span key={`${description}_${k}`}>
                  <InlineKeyCode>{k}</InlineKeyCode>
                  {idx + 1 !== keys.length && "+"}
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
`;

export default ShortcutModal;
