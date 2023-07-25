import { memo, useMemo } from "react";
import Highlight, { highlightColorList } from "components/Highlight";
import { highlighter } from "utils/highlighters";
import { hasOverlappingRegex } from "utils/regex";
import renderHtml from "utils/renderHtml";

interface HighlighterProps {
  ["data-cy"]?: string;
  children: string;
  color?: string;
  highlights?: RegExp;
  searchTerm?: RegExp;
}

const Highlighter: React.FC<HighlighterProps> = memo((props) => {
  const {
    "data-cy": dataCy,
    children: text,
    color,
    highlights,
    searchTerm,
  } = props;

  const htmlToRender = useMemo(() => {
    let render = text;

    if (searchTerm) {
      render = highlighter(
        searchTerm,
        render,
        (match) => `<mark>${match}</mark>`
      );
    }

    if (highlights && !hasOverlappingRegex(searchTerm, highlights, text)) {
      render = highlighter(
        highlights,
        render,
        (match, index) =>
          `<mark color="${
            highlightColorList[index % highlightColorList.length]
          }">${match}</mark>`
      );
    }

    return renderHtml(render, {
      preserveAttributes: ["mark"],
      transform: {
        mark: Highlight as unknown as React.ReactNode,
      },
    });
  }, [text, searchTerm, highlights]);

  return (
    <span data-cy={dataCy} style={{ color }}>
      {htmlToRender}
    </span>
  );
});

Highlighter.displayName = "Highlighter";
export default Highlighter;
