import parse, { Text } from "html-react-parser";
import Highlight, { highlightColorList } from "components/Highlight";
import { escapeTags } from "utils/escapeTags";
import { hasOverlappingRegex } from "utils/regex";
import renderHtml from "utils/renderHtml";
import { highlighter } from "./highlighter";

/**
 * `highlightHtml` adds highlights in the form of <mark> tags.
 * @param html - The html string to parse
 * @param searchTerm - The active search term as a regex expression
 * @param highlights - The active highlights as a regex expression
 * @returns - html string converted to an array of domnodes with highlighted text
 */
export const highlightHtml = (
  html: string = "",
  searchTerm: RegExp | undefined = undefined,
  highlights: RegExp | undefined = undefined,
) => {
  const escapedHtml = escapeTags(html);

  return parse(escapedHtml, {
    replace: (domNode) => {
      if (domNode instanceof Text) {
        let highlightedText = domNode.data;

        if (searchTerm) {
          highlightedText = highlighter(
            searchTerm,
            highlightedText,
            (match) => `<mark>${match}</mark>`,
          );
        }

        if (
          highlights &&
          !hasOverlappingRegex(searchTerm, highlights, domNode.data)
        ) {
          highlightedText = highlighter(
            highlights,
            highlightedText,
            (match, index) =>
              `<mark color="${
                highlightColorList[index % highlightColorList.length]
              }">${match}</mark>`,
          );
        }

        const highlightedHtml = renderHtml(highlightedText, {
          preserveAttributes: ["mark"],
          transform: {
            mark: Highlight as unknown as React.ReactNode,
          },
        });

        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <>{highlightedHtml}</>;
      }
    },
  });
};

export default highlightHtml;
