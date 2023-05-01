import { arrayBufferToStringArray } from ".";

describe("arrayBufferToStringArray", () => {
  it("converts a single line array buffer to a string array", () => {
    const string = "Hello World";
    const buffer = stringToArrayBuffer(string);
    expect(arrayBufferToStringArray(buffer)).toStrictEqual(["Hello World"]);
  });
  it("converts a multi line array buffer to a string array", () => {
    const string = "Hello World\nThis is a test";
    const buffer = stringToArrayBuffer(string);
    expect(arrayBufferToStringArray(buffer)).toStrictEqual([
      "Hello World",
      "This is a test",
    ]);
  });
  it("converts a single line array buffer with a trailing newline to a string array", () => {
    const string = "Hello World\n";
    const buffer = stringToArrayBuffer(string);
    expect(arrayBufferToStringArray(buffer)).toStrictEqual(["Hello World"]);
  });
  it("converts a multi line array buffer with a trailing newline to a string array", () => {
    const string = "Hello World\nThis is a test\n";
    const buffer = stringToArrayBuffer(string);
    expect(arrayBufferToStringArray(buffer)).toStrictEqual([
      "Hello World",
      "This is a test",
    ]);
  });
});

describe("stringToArrayBuffer", () => {
  it("sanity check", () => {
    const string = "Hello World";
    const buffer = stringToArrayBuffer(string);
    expect(buffer.byteLength).toBe(string.length);
    expect(new TextDecoder().decode(buffer)).toBe(string);
  });
});
const stringToArrayBuffer = (string: string): ArrayBuffer => {
  const buffer = new ArrayBuffer(string.length);
  const view = new DataView(buffer);
  for (let i = 0; i < string.length; i++) {
    view.setUint8(i, string.charCodeAt(i));
  }

  return buffer;
};
