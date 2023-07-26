import searchLogs from ".";

describe("searchLogs", () => {
  it("should return an empty array if there are no matching lines", () => {
    const lines = ["line 1", "line 2", "line 3"];
    const options = {
      getLine: (index: number) => lines[index],
      lowerBound: 0,
      processedLogLines: [0, 1, 2],
      searchRegex: /test/,
    };
    const matchingIndices = searchLogs(options);
    expect(matchingIndices).toStrictEqual([]);
  });
  it("should return an array of matching line numbers", () => {
    const lines = ["line 1", "line 2", "line 3"];
    const options = {
      getLine: (index: number) => lines[index],
      lowerBound: 0,
      processedLogLines: [0, 1, 2],
      searchRegex: /line/,
    };
    const matchingIndices = searchLogs(options);
    expect(matchingIndices).toStrictEqual([0, 1, 2]);
  });
  it("should return an array of matching line numbers with a lower bound", () => {
    const lines = ["line 1", "line 2", "line 3"];
    const getLine = jest.fn((index: number) => lines[index]);
    const options = {
      getLine,
      lowerBound: 1,
      processedLogLines: [0, 1, 2],
      searchRegex: /line/,
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
      getLine,
      lowerBound: 0,
      processedLogLines: [0, 1, 2],
      searchRegex: /line/,
      upperBound: 1,
    };
    const matchingIndices = searchLogs(options);
    expect(matchingIndices).toStrictEqual([0, 1]);
    expect(getLine).toHaveBeenCalledTimes(2);
    expect(getLine).toHaveBeenCalledWith(0);
    expect(getLine).toHaveBeenCalledWith(1);
  });
  it("should not match on folded lines and should return the processedLogLine index", () => {
    const lines = ["line 1", "line 2", "line 3", "line 4"];
    const getLine = jest.fn((index: number) => lines[index]);
    const options = {
      getLine,
      lowerBound: 0,
      processedLogLines: [0, [1, 2], 3],
      searchRegex: /line/,
    };
    const matchingIndices = searchLogs(options);
    expect(matchingIndices).toStrictEqual([0, 2]);
    expect(getLine).toHaveBeenCalledTimes(2);
    expect(getLine).toHaveBeenCalledWith(0);
    expect(getLine).toHaveBeenCalledWith(3);
  });
  it("should not search lines that are folded or if they are out of the range", () => {
    const lines = ["line 1", "line 2", "line 3", "line 4"];
    const getLine = jest.fn((index: number) => lines[index]);
    const options = {
      getLine,
      lowerBound: 0,
      processedLogLines: [0, [1, 2], 3],
      searchRegex: /line/,
      upperBound: 1,
    };
    const matchingIndices = searchLogs(options);
    expect(matchingIndices).toStrictEqual([0]);
    expect(getLine).toHaveBeenCalledTimes(1);
    expect(getLine).toHaveBeenCalledWith(0);
  });
});
