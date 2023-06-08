import parse, {
  Element,
  HTMLReactParserOptions,
  domToReact,
} from "html-react-parser";
import { escapeTags } from "./escapeTags";

interface renderHtmlOptions extends HTMLReactParserOptions {
  preserveAttributes?: string[];
  transform?: {
    [key: string]: React.ReactNode;
  };
}

const allowedTags = {
  a: ["href", "target", "rel", "class", "style"],
  span: ["style", "data-cy"],
  mark: ["style", "data-cy", "color"],
};

/**
 * `renderHtml` takes a string and converts it into an array of domnodes and
 * parses through them and swaps elements with other elements based on if they are
 * included in the transform object passed in through options. If you would like
 * to keep any classes applied to an item you want to swap you can pass it in as as part
 * of the preserveAttributes array
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
        return domNode;
      }
    },
  });
};

export default renderHtml;
