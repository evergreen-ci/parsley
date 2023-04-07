import {
  copyToClipboard,
  getJiraFormat,
  processLogString,
  shortenGithash,
  stringIntersection,
  trimStringFromMiddle,
} from ".";

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

describe("processLogString", () => {
  it("should split by the new line character", () => {
    expect(processLogString("process\nlog\nstring")).toStrictEqual([
      "process",
      "log",
      "string",
    ]);
  });
  it("should trim any trailing whitespace", () => {
    expect(processLogString("process\nlog\nstring\n          ")).toStrictEqual([
      "process",
      "log",
      "string",
    ]);
  });
  it("does not trim any whitespace that exists between log lines", () => {
    expect(processLogString("process\n\nlog\nstring")).toStrictEqual([
      "process",
      "",
      "log",
      "string",
    ]);
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

describe("shortenGithash", () => {
  it("shortens githash to 7 characters", () => {
    expect(shortenGithash("01234567")).toBe("0123456");
    expect(shortenGithash("012")).toBe("012");
  });
  it("handles undefined input", () => {
    expect(shortenGithash(undefined)).toBeUndefined();
  });
});

describe("trimStringFromMiddle", () => {
  it("trims middle text according to specified params", () => {
    expect(trimStringFromMiddle("task_name", 4)).toBe("ta…me"); // odd length
    expect(trimStringFromMiddle("task_name2", 4)).toBe("ta…e2"); // even length
  });
  it("doesn't trim middle text if original text is smaller than maxLength specified", () => {
    expect(trimStringFromMiddle("task_name", 10)).toBe("task_name");
  });
});
