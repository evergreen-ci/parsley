import xss, { IWhiteList } from "xss";

const allowedTags = {
  a: ["href", "target", "rel", "class", "style"],
  mark: ["style", "data-cy", "color"],
  span: ["style", "data-cy"],
};

/**
 * `escapeTags` is a utility function that takes a string with elements that resemble html tags and returns a string that
 * escapes the tags that are not allowed.
 * @param html - the html string to escape
 * @param whiteList - a mapping of HTML tags and attributes that should not be escaped
 * @returns The escaped html string
 */
const escapeTags = (html: string, whiteList?: IWhiteList) =>
  xss(html, {
    whiteList,
  });

export { escapeTags, allowedTags };
