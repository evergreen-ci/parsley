import { copyToClipboard, getJiraFormat, stringIntersection } from ".";

describe("copyToClipboard", () => {
  it("should copy the correct text", () => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: jest.fn(),
      },
    });
    copyToClipboard("copy text");
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("copy text");
  });
});

describe("getJiraFormat", () => {
  const logLines = ["zero", "one", "two", "three", "four", "five"];
  const getLine = (lineNumber: number) => logLines[lineNumber];

  it("should add an ellipsis between lines if they are not adjacent to each other", () => {
    const bookmarks = [0, 5];
    expect(getJiraFormat(bookmarks, getLine)).toBe(
      `{noformat}\n${logLines[0]}\n...\n${logLines[5]}\n{noformat}`
    );
  });

  it("should not add an ellipsis if the lines are adjacent", () => {
    const bookmarks = [0, 1];
    expect(getJiraFormat(bookmarks, getLine)).toBe(
      `{noformat}\n${logLines[0]}\n${logLines[1]}\n{noformat}`
    );
  });

  it("should return an empty string when there are no bookmarks", () => {
    const bookmarks: number[] = [];
    expect(getJiraFormat(bookmarks, getLine)).toBe("");
  });

  it("should handle out of bounds bookmarks", () => {
    const bookmarks = [6];
    expect(getJiraFormat(bookmarks, getLine)).toBe(`{noformat}\n{noformat}`);
  });

  it("should properly format the JIRA string", () => {
    const bookmarks = [0, 2, 4, 5];
    expect(getJiraFormat(bookmarks, getLine)).toBe(
      `{noformat}\n${logLines[0]}\n...\n${logLines[2]}\n...\n${logLines[4]}\n${logLines[5]}\n{noformat}`
    );
  });
});

describe("stringIntersection", () => {
  it("should return true if strings have any intersection", () => {
    expect(stringIntersection("abc", "bc")).toBeTruthy();
    expect(stringIntersection("bc", "abc")).toBeTruthy();
  });
  it("should return false if there isn't any overlap between the strings", () => {
    expect(stringIntersection("abc", "def")).toBeFalsy();
    expect(stringIntersection("def", "abc")).toBeFalsy();
  });
  it("should return false if there is only a partial overlap", () => {
    expect(stringIntersection("abc", "bcd")).toBeFalsy();
  });
});
