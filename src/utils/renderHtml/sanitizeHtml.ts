/**
 * `sanitizeHtml` is a utility function that takes a string of HTML and returns a version that sanitizes the tags that are not allowed
 * @param html - The html string to sanitize
 * @returns The sanitized html string
 */
const sanitizeHtml = (html: string, allowedTags: string[]) =>
  html.replace(/<[^<>]+>/g, (fakeTag) => {
    if (fakeTag.includes("</")) {
      // @ts-expect-error
      const tagName = fakeTag.match(/^<\/([^\s>]+)/)[1];
      if (allowedTags.includes(tagName)) {
        return fakeTag;
      }
      return fakeTag.replace(/[<>]/g, (match) => {
        if (match === "<") {
          return "&lt;";
        }
        return "&gt;";
      });
    }
    // @ts-expect-error
    const tagName = fakeTag.match(/^<([^\s>]+)/)[1];
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
