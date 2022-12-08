import { escapeHtml } from "./escapeHtml";
/**
 * `escapeTags` is a utility function that takes a string with elements that resemble html tags and returns a string that sanitizes the tags that are not allowed
 * @param html - The html string to sanitize
 * @returns The sanitized html string
 */
const escapeTags = (html: string, allowedTags: string[]) => {
  const matchTags = /<(\/?[a-z][a-z0-9]*)\b[^>]*>/g;
  return html.replace(matchTags, (tag) => {
    const isClosingTag = tag.includes("</");
    const tagName = isClosingTag
      ? tag.match(/^<\/([^\s>]+)/)?.[1]
      : tag.match(/^<([^\s>]+)/)?.[1];
    if (tagName === undefined) {
      return tag;
    }
    if (allowedTags.includes(tagName)) {
      // Allow the tag if it is allowed
      return tag;
    }
    return escapeHtml(tag);
  });
};

export { escapeTags };
