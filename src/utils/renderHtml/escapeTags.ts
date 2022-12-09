import xss, { IWhiteList } from "xss";

/**
 * `escapeTags` is a utility function that takes a string with elements that resemble html tags and returns a string that sanitizes the tags that are not allowed
 * @param html - The html string to sanitize
 * @returns The sanitized html string
 */
const escapeTags = (html: string, allowedTags?: IWhiteList) =>
  xss(html, {
    whiteList: allowedTags,
  });

export { escapeTags };
