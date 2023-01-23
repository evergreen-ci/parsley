import "@testing-library/jest-dom/extend-expect";

// Avoid printing debug statements when running tests.
jest.spyOn(console, "debug").mockImplementation();

// Avoid printing error statements when running tests.
jest.spyOn(console, "error").mockImplementation();

// Avoid printing analytics events when running tests, but print any other console.log statements.
const consoleLog = console.log;
console.log = (message: string) => {
  if (message.startsWith("ANALYTICS EVENT")) {
    return;
  }
  consoleLog(message);
};
