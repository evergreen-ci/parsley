/**
 * Function that copies text to a user's clipboard.
 * @param textToCopy - text to be copied
 */
export const copyToClipboard = (textToCopy: string) => {
  navigator.clipboard.writeText(textToCopy);
};

/**
 * Function that is used to copy the string for the JIRA button in the Details Overlay panel.
 * @param bookmarks - list of numbers representing the applied bookmarks
 * @param logLines - flat list of log lines
 * @returns formatted string that can be pasted into JIRA
 */
export const getJiraFormat = (bookmarks: number[], logLines: string[]) => {
  if (bookmarks.length === 0) {
    return "";
  }

  let jiraString = "{noformat}\n";

  for (let i = 0; i < bookmarks.length; i++) {
    const bookmarkLine = bookmarks[i];

    if (bookmarkLine >= logLines.length) {
      jiraString += "{noformat}";
      return jiraString;
    }

    // Add the log text to the string.
    jiraString += `${logLines[bookmarkLine]}\n`;

    // If the current and next bookmark are not adjacent to each other, insert an
    // ellipsis in between them.
    if (i + 1 !== bookmarks.length && bookmarkLine + 1 !== bookmarks[i + 1]) {
      jiraString += "...\n";
    }
  }
  jiraString += "{noformat}";
  return jiraString;
};
