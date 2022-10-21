import { isExpanded, mergeIntervals } from ".";

describe("mergeIntervals", () => {
  it("merges intervals if they can be merged", () => {
    expect(
      mergeIntervals([
        [89, 94],
        [95, 96],
        [97, 102],
      ])
    ).toStrictEqual([[89, 102]]);
  });

  it("does not merge intervals if they cannot be merged", () => {
    expect(
      mergeIntervals([
        [89, 94],
        [97, 102],
      ])
    ).toStrictEqual([
      [89, 94],
      [97, 102],
    ]);
  });

  it("works when called multiple times in succession", () => {
    const firstMerge = mergeIntervals([
      [0, 5],
      [20, 25],
    ]);
    expect(firstMerge).toStrictEqual([
      [0, 5],
      [20, 25],
    ]);

    const secondMerge = mergeIntervals([...firstMerge, [6, 11], [14, 19]]);
    expect(secondMerge).toStrictEqual([
      [0, 11],
      [14, 25],
    ]);

    const thirdMerge = mergeIntervals([...secondMerge, [12, 13]]);
    expect(thirdMerge).toStrictEqual([[0, 25]]);
  });
});

describe("isExpanded", () => {
  it("should return true if a line number is within the expanded ranges", () => {
    expect(
      isExpanded(25, [
        [0, 5],
        [23, 27],
        [30, 45],
      ])
    ).toBe(true);
  });

  it("should return false if a line number is not within the expanded ranges", () => {
    expect(
      isExpanded(20, [
        [0, 5],
        [23, 27],
        [30, 45],
      ])
    ).toBe(false);
  });
});
