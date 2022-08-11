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
    "react-hooks/rules-of-hooks": ERROR, // Checks rules of Hooks
    "react-hooks/exhaustive-deps": WARN, // Warns useMemo, useEffect dependencies

    // Rules for React.
    "react/destructuring-assignment": OFF, // Allows use of dot notation, for example user.id
    "react/function-component-definition": [
      errorIfStrict,
      {
        namedComponents: "arrow-function", // Allows named components with arrow functions
      },
    ],
    "react/jsx-filename-extension": [1, { extensions: [".tsx"] }], // Allow JSX in TSX file (airbnb rule)
    "react/jsx-props-no-spreading": OFF, // Allows spreading props like {...props}
    "react/prop-types": OFF,
    "react/react-in-jsx-scope": OFF, // Disable because there is no need to import React in React 17+
    "react/require-default-props": OFF,
  },
};
