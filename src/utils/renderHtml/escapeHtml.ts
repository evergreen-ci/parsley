/**
 * `escapeHtml` escapes HTML special characters in a string.
 * @param html - The html string to escape
 * @returns  The escaped html string
 */
const escapeHtml = (html: string) =>
  html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export { escapeHtml };
