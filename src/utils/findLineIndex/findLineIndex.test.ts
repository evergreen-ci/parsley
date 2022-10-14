import { findLineIndex } from ".";

const processedLines = [0, [1, 2], 3, [4, 5], 6, [7, 8, 9], 10];

describe("findLineIndex", () => {
  it("should correctly determine index when line number exists in array", () => {
    expect(findLineIndex(processedLines, 0)).toBe(0);
    expect(findLineIndex(processedLines, 3)).toBe(2);
    expect(findLineIndex(processedLines, 6)).toBe(4);
  });

  it("should correctly determine index when line number exists in nested array", () => {
    expect(findLineIndex(processedLines, 1)).toBe(1);
    expect(findLineIndex(processedLines, 4)).toBe(3);
  });

  it("should return -1 when line number does not exist in array", () => {
    expect(findLineIndex(processedLines, -1)).toBe(-1);
    expect(findLineIndex(processedLines, 11)).toBe(-1);
  });
});
