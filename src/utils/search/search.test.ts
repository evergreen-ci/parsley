import { findLineIndex } from ".";

const processedLines = [0, [1, 2], 3, [4, 5], 6, 7];

describe("findLineIndex", () => {
  it("correctly determines index when line number exists in array", () => {
    expect(findLineIndex(processedLines, 0)).toBe(0);
    expect(findLineIndex(processedLines, 1)).toBe(1);
    expect(findLineIndex(processedLines, 3)).toBe(2);
    expect(findLineIndex(processedLines, 4)).toBe(3);
    expect(findLineIndex(processedLines, 7)).toBe(5);
  });

  it("returns `undefined` when line number does not exist in array", () => {
    expect(findLineIndex(processedLines, -1)).toBeUndefined();
    expect(findLineIndex(processedLines, 8)).toBeUndefined();
  });
});
