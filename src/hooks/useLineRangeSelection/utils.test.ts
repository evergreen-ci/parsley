import { encodeSelectedLineRange, parseSelectedLineRange } from "./utils";

describe("parseSelectedLineRange", () => {
  it("should parse a selected line range", () => {
    const selectedLineRange = "L1-L10";
    expect(parseSelectedLineRange(selectedLineRange)).toStrictEqual({
      endingLine: 10,
      startingLine: 1,
    });
  });
  it("should parse a selected line range with a single line", () => {
    const selectedLineRange = "L1";
    expect(parseSelectedLineRange(selectedLineRange)).toStrictEqual({
      endingLine: undefined,
      startingLine: 1,
    });
  });
});

describe("encodeSelectedLineRange", () => {
  it("should encode a selected line range", () => {
    expect(encodeSelectedLineRange({ endingLine: 10, startingLine: 1 })).toBe(
      "L1-L10"
    );
  });
  it("should encode a selected line range with a single line", () => {
    expect(encodeSelectedLineRange({ endingLine: 1, startingLine: 1 })).toBe(
      "L1"
    );
  });
  it("should return an empty string if either line is undefined", () => {
    expect(
      encodeSelectedLineRange({ endingLine: undefined, startingLine: 1 })
    ).toBe("L1");
  });
});
