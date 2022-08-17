module.exports = {
  "(?!src/)*.{js,ts,tsx}": ["STRICT=1 eslint -c .eslintrc.js", "yarn prettier"], // For files that are not in src/, run eslint and prettier
  "src/**/*.{js,ts,tsx}": ["yarn eslint-staged:src", "yarn prettier"], // For files in src/, run eslint and prettier
  // "cypress/**/*.{js,ts}": ["STRICT=1 eslint -c src/.eslintrc.js", "yarn prettier"], // For files in cypress/, run eslint and prettier
  "*.{ts,tsx}": "yarn check-types", // For TypeScript files, check types
};
