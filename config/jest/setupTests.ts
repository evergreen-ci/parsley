// jest-dom adds custom jest matchers for asserting on DOM nodes.
import "@testing-library/jest-dom/extend-expect";

// The following two variables are dummy values used in auth.test.tsx.
process.env.REACT_APP_EVERGREEN_URL = "test-evergreen.com";
process.env.REACT_APP_GRAPHQL_URL = "test-graphql.com";

if (process.env.CI) {
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
}

// Mock focus-trap-react to prevent errors in tests that use modals. focus-trap-react is a package used
// by LeafyGreen and is not a direct dependency of Spruce.
jest.mock("focus-trap-react", () => {
  const focusTrap = jest.requireActual("focus-trap-react");
  focusTrap.prototype.setupFocusTrap = () => null;
  return focusTrap;
});
