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
 * `renderHtml` takes a string and converts it into an array of domnodes and
 * parses through them and swaps elements with other elements based on if they are
 * included in the transform object passed in through options. If you would like
 * to keep any classes applied to an item you want to swap you can pass it in as part
 * of the preserveAttributes array
 * @param html - The html string to parse
 * @param searchTerm - The active search term
 * @param highlights - The active highlights
 * @returns - html string converted to an array of domnodes
 */
const renderHtml = (
  html: string = "",
  searchTerm: RegExp | undefined = undefined,
  highlights: RegExp | undefined = undefined
) => {
  const escapedHtml = escapeTags(html, allowedTags);

  return parse(escapedHtml, {
    replace: (domNode) => {
      if (domNode instanceof Text) {
        let markedText = domNode.data;

        if (searchTerm) {
          markedText = highlighter(
            searchTerm,
            markedText,
            (match) => `<mark>${match}</mark>`
          );
        }

        if (
          highlights &&
          !hasOverlappingRegex(searchTerm, highlights, domNode.data)
        ) {
          markedText = highlighter(
            highlights,
            markedText,
            (match, index) =>
              `<mark color="${
                highlightColorList[index % highlightColorList.length]
              }">${match}</mark>`
          );
        }

        const render = parseWithReplace(markedText, {
          preserveAttributes: ["mark"],
          transform: {
            mark: Highlight as unknown as React.ReactNode,
          },
        });

        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <>{render}</>;
      }
    },
  });
};

export const parseWithReplace = (
  html: string = "",
  options: renderHtmlOptions = {}
) => {
  const escapedHtml = escapeTags(html, allowedTags);

  return parse(escapedHtml, {
    replace: (d) => {
      if (d instanceof Element) {
        if (options.transform && options.transform[d.name]) {
          const SwapComponent = options.transform[d.name];
          // SwapComponent is just what ever component we want to return from the transform object
          const extraProps =
            options.preserveAttributes &&
            options.preserveAttributes.includes(d.name)
              ? d.attribs
              : {};
          return (
            // @ts-expect-error
            <SwapComponent className={extraProps.class} {...extraProps}>
              {domToReact(d.children)}
            </SwapComponent>
          );
        }
      }
    },
  });
};

export default renderHtml;
