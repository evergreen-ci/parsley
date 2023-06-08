import xss, { IWhiteList } from "xss";

/**
 * `escapeTags` is a utility function that takes a string with elements that resemble html tags and returns a string that
 * escapes the tags that are not allowed.
 * @param html - the html string to escape
 * @param allowedTags - a mapping of HTML tags and attributes that should not be escaped
 * @returns The escaped html string
 */
const escapeTags = (html: string, allowedTags?: IWhiteList) =>
  xss(html, {
    whiteList: allowedTags,
  });

export { escapeTags };
