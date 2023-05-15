import { fileToStream } from ".";

describe("fileToStream", () => {
  it("should return a stream", async () => {
    const file = new File(["Hello World"], "hello.txt", { type: "text/plain" });
    const stream = await fileToStream(file);
    expect(stream).toBeDefined();
  });
  it("should return a stream with the correct content", async () => {
    const file = new File(["Hello World"], "hello.txt", { type: "text/plain" });
    const stream = await fileToStream(file);
    const reader = stream.getReader();
    const result = await reader.read();
    expect(result.value).toStrictEqual(stringToArrayBuffer("Hello World"));
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
