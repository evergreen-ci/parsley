import searchLogs from ".";

describe("searchLogs", () => {
  it("should return an empty array if there are no matching lines", () => {
    const lines = ["line 1", "line 2", "line 3"];
    const options = {
      searchRegex: /test/,
      lowerBound: 0,
      getLine: (index: number) => lines[index],
      processedLogLines: [0, 1, 2],
    };
    const matchingIndices = searchLogs(options);
    expect(matchingIndices).toStrictEqual([]);
  });
  it("should return an array of matching line numbers", () => {
    const lines = ["line 1", "line 2", "line 3"];
    const options = {
      searchRegex: /line/,
      lowerBound: 0,
      getLine: (index: number) => lines[index],
      processedLogLines: [0, 1, 2],
    };
    const matchingIndices = searchLogs(options);
    expect(matchingIndices).toStrictEqual([0, 1, 2]);
  });
  it("should return an array of matching line numbers with a lower bound", () => {
    const lines = ["line 1", "line 2", "line 3"];
    const getLine = jest.fn((index: number) => lines[index]);
    const options = {
      searchRegex: /line/,
      lowerBound: 1,
      getLine,
      processedLogLines: [0, 1, 2],
    };
    const matchingIndices = searchLogs(options);
    expect(matchingIndices).toStrictEqual([1, 2]);
    expect(getLine).toHaveBeenCalledTimes(2);
    expect(getLine).toHaveBeenCalledWith(1);
    expect(getLine).toHaveBeenCalledWith(2);
  });
  it("should return an array of matching line numbers with an upper bound", () => {
    const lines = ["line 1", "line 2", "line 3"];
    const getLine = jest.fn((index: number) => lines[index]);
    const options = {
      searchRegex: /line/,
      lowerBound: 0,
      upperBound: 1,
      getLine,
      processedLogLines: [0, 1, 2],
    };
    const matchingIndices = searchLogs(options);
    expect(matchingIndices).toStrictEqual([0, 1]);
    expect(getLine).toHaveBeenCalledTimes(2);
    expect(getLine).toHaveBeenCalledWith(0);
    expect(getLine).toHaveBeenCalledWith(1);
  });
  it("should not search lines that are folded", () => {
    const lines = ["line 1", "line 2", "line 3", "line 4"];
    const getLine = jest.fn((index: number) => lines[index]);
    const options = {
      searchRegex: /line/,
      lowerBound: 0,
      getLine,
      processedLogLines: [0, [1, 2], 3],
    };
    const matchingIndices = searchLogs(options);
    expect(matchingIndices).toStrictEqual([0, 3]);
    expect(getLine).toHaveBeenCalledTimes(2);
    expect(getLine).toHaveBeenCalledWith(0);
    expect(getLine).toHaveBeenCalledWith(3);
  });
  it("should not search lines that are folded or if they are out of the range", () => {
    const lines = ["line 1", "line 2", "line 3", "line 4"];
    const getLine = jest.fn((index: number) => lines[index]);
    const options = {
      searchRegex: /line/,
      lowerBound: 0,
      upperBound: 1,
      getLine,
      processedLogLines: [0, [1, 2], 3],
    };
    const matchingIndices = searchLogs(options);
    expect(matchingIndices).toStrictEqual([0]);
    expect(getLine).toHaveBeenCalledTimes(1);
    expect(getLine).toHaveBeenCalledWith(0);
  });
});
