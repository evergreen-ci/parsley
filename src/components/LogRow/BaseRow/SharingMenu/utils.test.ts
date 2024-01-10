import { getLinesInProcessedLogLinesFromSelectedLines } from "./utils";

describe("getLinesInProcessedLogLinesFromSelectedLines", () => {
  it("should return empty array if no lines are selected", () => {
    const processedLogLines = [1, 2, 3, 4, 5];
    const selectedLines = { endingLine: undefined, startingLine: undefined };
    const result = getLinesInProcessedLogLinesFromSelectedLines(
      processedLogLines,
      selectedLines,
    );
    expect(result).toStrictEqual([]);
  });
  it("should return the lines in the selected range", () => {
    const processedLogLines = [1, 2, 3, 4, 5];
    const selectedLines = { endingLine: 3, startingLine: 2 };
    const result = getLinesInProcessedLogLinesFromSelectedLines(
      processedLogLines,
      selectedLines,
    );
    expect(result).toStrictEqual([2, 3]);
  });
  it("should not return collapsed lines", () => {
    const processedLogLines = [1, 2, [3], 4, 5];
    const selectedLines = { endingLine: 4, startingLine: 2 };
    const result = getLinesInProcessedLogLinesFromSelectedLines(
      processedLogLines,
      selectedLines,
    );
    expect(result).toStrictEqual([2, 4]);
  });
  it("should return the starting line if no ending line is provided", () => {
    const processedLogLines = [1, 2, 3, 4, 5];
    const selectedLines = { endingLine: undefined, startingLine: 2 };
    const result = getLinesInProcessedLogLinesFromSelectedLines(
      processedLogLines,
      selectedLines,
    );
    expect(result).toStrictEqual([2]);
  });
});
