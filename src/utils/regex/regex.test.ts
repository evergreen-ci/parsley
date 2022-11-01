import { hasOverlappingRegex } from ".";

describe("hasOverlappingRegex", () => {
  it("should return true if regexes fully overlap", () => {
    const regex1 = /a/;
    const regex2 = /a/;
    const text = "a";
    expect(hasOverlappingRegex(regex1, regex2, text)).toBe(true);
  });
  it("should return true if regexes partially overlap", () => {
    const regex1 = /abc/;
    const regex2 = /ab/;
    const text = "abcd";

    expect(hasOverlappingRegex(regex1, regex2, text)).toBe(true);
  });
  it("should return false if regexes do not overlap", () => {
    const regex1 = /a/;
    const regex2 = /b/;
    const text = "a";
    expect(hasOverlappingRegex(regex1, regex2, text)).toBe(false);
  });
  it("should return false if both regexes match a line but the results don't overlap", () => {
    const regex1 = /a/;
    const regex2 = /b/;
    const text = "a doesn't match with b";
    expect(hasOverlappingRegex(regex1, regex2, text)).toBe(false);
  });
  it("should return false if regexes do not match", () => {
    const regex1 = /a/;
    const regex2 = /b/;
    const text = "c";
    expect(hasOverlappingRegex(regex1, regex2, text)).toBe(false);
  });
});
