const ERROR = "error";
const WARN = "warn";
const OFF = "off";

const errorIfStrict = process.env.STRICT ? ERROR : WARN;

module.exports = {
  extends: ["../.eslintrc.js"],
  // TODO EVG-17441 & EVG-17445: Add plugins.
  plugins: ["jsx-a11y", "react", "react-hooks"],
  rules: {
    // TODO EVG-17445: Add rules for emotion.

    // Rules for accessibility.
    "jsx-a11y/anchor-is-valid": errorIfStrict,
    "jsx-a11y/aria-props": errorIfStrict,
    "jsx-a11y/aria-role": [errorIfStrict, { ignoreNonDom: false }],
    "jsx-a11y/label-has-associated-control": [
      errorIfStrict,
      { some: ["nesting", "id"] },
    ],

    // Rules for React Hooks.
    "react-hooks/rules-of-hooks": ERROR, // Check rules of Hooks
    "react-hooks/exhaustive-deps": WARN, // Warn useMemo, useEffect dependencies

    // Rules for React.
    "react/destructuring-assignment": OFF, // Allow use of dot notation, for example user.id (airbnb rule)
    "react/function-component-definition": [
      errorIfStrict,
      {
        namedComponents: "arrow-function", // Allow named components with arrow functions (airbnb rule)
      },
    ],
    "react/jsx-filename-extension": [1, { extensions: [".tsx"] }], // Allow JSX in TSX file (airbnb rule)
    "react/jsx-props-no-spreading": OFF, // Allow spreading props like {...props} (airbnb rule)
    "react/jsx-sort-props": WARN, // Sort props alphabetically
    "react/prop-types": OFF, // (airbnb rule)
    "react/react-in-jsx-scope": OFF, // Disable because there is no need to import React in React 17+ (airbnb rule)
    "react/require-default-props": OFF, // Allow not setting defaults for props (airbnb rule)
  },
  overrides: [
    {
      files: ["*.test.ts", "*.test.tsx"],
      extends: ["plugin:testing-library/react", "plugin:jest/all"],
      rules: {
        "jest/no-hooks": OFF,
        "jest/no-mocks-import": OFF,
        "jest/prefer-expect-assertions": OFF,
      },
    },
  ],
};
