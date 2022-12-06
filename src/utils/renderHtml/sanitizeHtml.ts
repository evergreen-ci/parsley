/**
 * `sanitizeHtml` is a utility function that takes a string of HTML and returns a version that sanitizes the tags that are not allowed
 * @param html - The html string to sanitize
 * @returns The sanitized html string
 */
const sanitizeHtml = (html: string, allowedTags: string[]) =>
  html.replace(/<[^<>]+>/g, (fakeTag) => {
    // Check if the tag is a closing tag
    if (fakeTag.includes("</")) {
      const tagName = fakeTag.match(/^<\/([^\s>]+)/)?.[1];
      if (tagName === undefined) {
        return fakeTag;
      }
      if (allowedTags.includes(tagName)) {
        // Allow the tag if it is allowed
        return fakeTag;
      }
      return fakeTag.replace(/[<>]/g, (match) => {
        if (match === "<") {
          return "&lt;";
        }
        return "&gt;";
      });
    }
    // handle opening tags
    const tagName = fakeTag.match(/^<([^\s>]+)/)?.[1];
    if (tagName === undefined) {
      return fakeTag;
    }
    if (allowedTags.includes(tagName)) {
      return fakeTag;
    }
    return fakeTag.replace(/[<>]/g, (match) => {
      if (match === "<") {
        return "&lt;";
      }
      return "&gt;";
    });
  });

export { sanitizeHtml };
