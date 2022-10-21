import { arraySymmetricDifference } from ".";

describe("arraySymmetricDifference", () => {
  it("should throw an error if an object is passed in", () => {
    expect(() => arraySymmetricDifference([{}], [{}])).toThrow(
      TypeError("arraySymmetricDifference does not support objects")
    );
  });
  it("should return an empty array when the arrays are empty", () => {
    expect(arraySymmetricDifference([], [])).toStrictEqual([]);
  });
  it("should return the differing values when the first array is empty", () => {
    expect(arraySymmetricDifference([], ["1", "2", "3"])).toStrictEqual([
      "1",
      "2",
      "3",
    ]);
  });
  it("should return the differing values when the second array is empty", () => {
    expect(arraySymmetricDifference(["1", "2", "3"], [])).toStrictEqual([
      "1",
      "2",
      "3",
    ]);
  });
  it("should return the symmetric difference when the arrays have no common elements", () => {
    expect(
      arraySymmetricDifference(["1", "2", "3"], ["4", "5", "6"])
    ).toStrictEqual(["1", "2", "3", "4", "5", "6"]);
  });
  it("should return the symmetric difference when the arrays have common elements", () => {
    expect(
      arraySymmetricDifference(["1", "2", "3"], ["3", "4", "5"])
    ).toStrictEqual(["1", "2", "4", "5"]);
  });
});
