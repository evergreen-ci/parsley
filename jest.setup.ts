import { ReadableStream } from "web-streams-polyfill/ponyfill";
import { TextDecoder, TextEncoder } from "util";

// Polyfill ReadableStream for Jest tests
// @ts-expect-error -- ReadableStream is not defined in the global scope
global.ReadableStream = ReadableStream;

// @ts-expect-error -- Polyfill TextDecoder for Jest tests
global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;
