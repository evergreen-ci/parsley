import { memo, useMemo } from "react";
import highlightHtml from "utils/highlightHtml";

interface HighlighterProps {
  ["data-cy"]?: string;
  children: string;
  color?: string;
  highlights?: RegExp;
  searchTerm?: RegExp;
}

const Highlighter: React.FC<HighlighterProps> = memo((props) => {
  const {
    children: text,
    color,
    "data-cy": dataCy,
    highlights,
    searchTerm,
  } = props;

  const htmlToRender = useMemo(
    () => highlightHtml(text, searchTerm, highlights),
    [text, searchTerm, highlights]
  );

  return (
    <span data-cy={dataCy} style={{ color }}>
      {htmlToRender}
    </span>
  );
});

Highlighter.displayName = "Highlighter";
export default Highlighter;
