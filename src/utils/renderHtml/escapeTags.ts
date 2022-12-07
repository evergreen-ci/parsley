/**
 * `escapeTags` is a utility function that takes a string with elements that resemble html tags and returns a string that
 * escapes the tags that are not allowed.
 * @param html - the html string to escape
 * @returns The escaped html string
 */
const escapeTags = (html: string, allowedTags: string[]) =>
  html.replace(/<[^<>]+>/g, (tag) => {
    // Check if the tag is a closing tag
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
    return tag.replace(/[<>]/g, (match) => {
      if (match === "<") {
        return "&lt;";
      }
      return "&gt;";
    });
  });

export { escapeTags };
