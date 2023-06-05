import parse, {
  Element,
  HTMLReactParserOptions,
  domToReact,
} from "html-react-parser";
import { escapeTags } from "./escapeTags";
/**
 * renderHtml takes a string and converts it into an array of domnodes and
 * parses through them and swaps elements with other elements based on if they are
 * included in the transform object passed in through options. If you would like
 * to keep any classes applied to an item you want to swap you can pass it in as as part
 * of the preserveAttributes array
 * @param {string} html
 * @param {object} options
 *  @param {object} options.transform
 *    options.transform.key Element to Swap
 *    options.transform.value Component to replace the element with
 *    options.externalAnchorsNewTab If true, anchor tags with class="reference external" will be set to open in a new browser tab
 *  preserveAttributes Which components should keep their classes
 * @returns {React.ReactNode}
 */

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
