import { constructJiraString, copyToClipboard } from ".";

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

describe("constructJiraString", () => {
  it("should properly format text", () => {
    const bookmarks = [0, 2, 4, 5];
    const logLines = ["zero", "one", "two", "three", "four", "five"];

    expect(constructJiraString(bookmarks, logLines)).toBe(
      `{noformat}\n${logLines[0]}\n...\n${logLines[2]}\n...\n${logLines[4]}\n${logLines[5]}\n{noformat}`
    );
  });
});
