module.exports = {
  "(?!src/)*.{js,ts,tsx}": ["yarn eslint:staged", "yarn prettier"], // For files that are not in src/, run eslint and prettier
  "src/**/*.{js,ts,tsx}": ["yarn eslint:staged", "yarn prettier"], // For files in src/, run eslint and prettier
  "cypress/**/*.{js,ts}": ["yarn eslint:staged", "yarn prettier"], // For files in cypress/, run eslint and prettier
  "src/gql/**/*.graphql": [
    "yarn eslint:staged",
    "yarn prettier --parser graphql",
  ], // For GraphQL files, run eslint and prettier
  "*.{ts,tsx}": () => "yarn check-types", // For TypeScript files, check types
};
