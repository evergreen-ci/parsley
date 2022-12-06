/**
 * `escapeTags` is a utility function that takes a string with elements that resemble html tags and returns a string that sanitizes the tags that are not allowed
 * @param html - The html string to sanitize
 * @returns The sanitized html string
 */
const escapeTags = (html: string, allowedTags: string[]) =>
  html.replace(/<[^<>]+>/g, (tag) => {
    // Check if the tag is a closing tag
    if (tag.includes("</")) {
      const tagName = tag.match(/^<\/([^\s>]+)/)?.[1];
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
    }
    // handle opening tags
    const tagName = tag.match(/^<([^\s>]+)/)?.[1];
    if (tagName === undefined) {
      return tag;
    }
    if (allowedTags.includes(tagName)) {
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
