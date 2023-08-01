import parse, {
  Element,
  HTMLReactParserOptions,
  Text,
  domToReact,
} from "html-react-parser";
import Highlight, { highlightColorList } from "components/Highlight";
import { highlighter } from "utils/highlighters";
import { hasOverlappingRegex } from "utils/regex";
import { escapeTags } from "./escapeTags";

interface renderHtmlOptions extends HTMLReactParserOptions {
  preserveAttributes?: string[];
  transform?: {
    [key: string]: React.ReactNode;
  };
}

const allowedTags = {
  a: ["href", "target", "rel", "class", "style"],
  mark: ["style", "data-cy", "color"],
  span: ["style", "data-cy"],
};

/**
 * `renderHtml` takes a string and converts it into an array of domnodes for parsing.
 * Elements are swapped with other elements based on if they are included in the options.transform
 * object. If you would like to keep any attributes (classnames, styles, etc), you can pass it in
 * as part of the options.preserveAttributes array.
 * @param html - The html string to parse
 * @param options - Options to pass to html-react-parser
 * @param options.transform - Map of elements to swap out
 * @param options.preserveAttributes - Array of elements to preserve attributes for
 * @returns - html string converted to an array of domnodes
 */
const renderHtml = (html: string = "", options: renderHtmlOptions = {}) => {
  const escapedHtml = escapeTags(html, allowedTags);

  return parse(escapedHtml, {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        if (options.transform && options.transform[domNode.name]) {
          const SwapComponent = options.transform[domNode.name];
          // SwapComponent is just what ever component we want to return from the transform object
          const extraProps =
            options.preserveAttributes &&
            options.preserveAttributes.includes(domNode.name)
              ? domNode.attribs
              : {};

          return (
            // @ts-expect-error
            <SwapComponent className={extraProps.class} {...extraProps}>
              {domToReact(domNode.children)}
            </SwapComponent>
          );
        }
      }
      return domNode;
    },
  });
};

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
  highlights: RegExp | undefined = undefined
) => {
  const escapedHtml = escapeTags(html, allowedTags);

  return parse(escapedHtml, {
    replace: (domNode) => {
      if (domNode instanceof Text) {
        let highlightedText = domNode.data;

        if (searchTerm) {
          highlightedText = highlighter(
            searchTerm,
            highlightedText,
            (match) => `<mark>${match}</mark>`
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
              }">${match}</mark>`
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

export default renderHtml;
