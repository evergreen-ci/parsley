import { getRegexpError } from ".";

describe("getRegexpError", () => {
  it("returns an empty string if the regexp is valid", () => {
    expect(getRegexpError(".*")).toBe("");
  });
  it("returns an error message if the regexp is invalid", () => {
    expect(getRegexpError(".*(")).toBe("Unterminated group");
    expect(getRegexpError(".*[")).toBe("Unterminated character class");
  });
});
