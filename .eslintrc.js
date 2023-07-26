const ERROR = "error";
const WARN = "warn";
const OFF = "off";

const errorIfStrict = process.env.STRICT ? ERROR : WARN;

module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    // Airbnb includes some helpful rules for ESLint and React that aren't covered by recommended.
    // See https://github.com/airbnb/javascript/tree/master/packages for specific rules.
    "airbnb",
    "plugin:prettier/recommended", // Note: prettier must ALWAYS be the last extension.
  ],
  ignorePatterns: ["!.storybook"],
  overrides: [
    // For React Typescript files in src.
    {
      extends: [
        "plugin:react/recommended",
        "plugin:jsdoc/recommended-typescript-error",
      ],
      files: ["src/**/*.ts", "src/**/*.tsx"],
      parserOptions: {
        project: ["./tsconfig.json"],
      },
      plugins: [
        "jsx-a11y",
        "react",
        "react-hooks",
        "@emotion",
        "sort-keys-plus",
        "sort-destructure-keys",
      ],
      rules: {
        // Rules for emotion.
        "@emotion/import-from-emotion": ERROR,
        "@emotion/no-vanilla": errorIfStrict,
        "@emotion/pkg-renaming": ERROR,
        "@emotion/syntax-preference": [errorIfStrict, "string"],

        // Rules for accessibility.
        "jsx-a11y/anchor-is-valid": errorIfStrict,
        "jsx-a11y/aria-props": errorIfStrict,
        "jsx-a11y/aria-role": [errorIfStrict, { ignoreNonDom: false }],
        "jsx-a11y/label-has-associated-control": [
          errorIfStrict,
          { some: ["nesting", "id"] },
        ],

        // Check rules of Hooks
        "react-hooks/exhaustive-deps": WARN,
        // Rules for React Hooks.
        "react-hooks/rules-of-hooks": ERROR, // Warn useMemo, useEffect dependencies

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

        "sort-destructure-keys/sort-destructure-keys": [
          errorIfStrict,
          { caseSensitive: true },
        ],
        "sort-keys-plus/sort-keys": [
          errorIfStrict,
          "asc",
          { allowLineSeparatedGroups: true, natural: true },
        ],
      },
    },
    // For Jest files.
    {
      extends: ["plugin:testing-library/react", "plugin:jest/all"],
      files: ["src/**/*.test.ts", "src/**/*.test.tsx"],
      rules: {
        "@typescript-eslint/unbound-method": OFF,
        "jest/no-hooks": OFF,
        "jest/no-mocks-import": OFF,
        "jest/prefer-expect-assertions": OFF,
        "jest/unbound-method": OFF,
      },
    },
    // For Storybook files.
    {
      extends: ["plugin:storybook/recommended"],
      files: ["src/**/*.stories.ts", "src/**/*.stories.tsx"],
      rules: {
        "storybook/no-stories-of": ERROR,
      },
    },
    // For Cypress files.
    {
      extends: ["plugin:cypress/recommended"],
      files: ["cypress/**/*.ts"],
      parserOptions: {
        project: "cypress/tsconfig.json",
      },
    },
    // For GraphQL files.
    {
      extends: "plugin:@graphql-eslint/operations-recommended",
      files: ["src/gql/**/*.graphql"],
      rules: {
        "@graphql-eslint/alphabetize": [
          ERROR,
          { selections: ["OperationDefinition", "FragmentDefinition"] },
        ],
        // Following rule can possibly be removed after ESLint updates.
        "spaced-comment": OFF,
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    // Rules for ESLint.
    "arrow-body-style": [
      errorIfStrict,
      "as-needed",
      {
        requireReturnForObjectLiteral: false,
      },
    ],
    "consistent-return": OFF,
    curly: [errorIfStrict, "multi-line"],
    eqeqeq: [errorIfStrict, "always", { null: "ignore" }],
    "no-console": OFF,
    "no-debugger": errorIfStrict,
    "no-empty": [ERROR, { allowEmptyCatch: true }],
    "no-plusplus": [ERROR, { allowForLoopAfterthoughts: true }],
    "no-shadow": OFF,
    "no-undef": OFF,
    "no-unused-vars": OFF,
    "no-use-before-define": OFF,
    "sort-imports": [
      ERROR,
      {
        ignoreDeclarationSort: true,
      },
    ],

    // Rules for typescript-eslint. Note that these rules extend the ESLint rules. This can cause conflicts, so the original
    // ESLint rules above must be disabled for the following rules to work.
    "@typescript-eslint/no-shadow": ERROR,
    "@typescript-eslint/no-unused-vars": [
      errorIfStrict,
      {
        args: "after-used",
        ignoreRestSiblings: true,
        vars: "all",
      },
    ],
    "@typescript-eslint/no-use-before-define": [
      ERROR,
      { functions: false, variables: false },
    ],

    // Rules for eslint-plugin-import. These describe rules about file imports.
    "import/extensions": [
      ERROR, // Allow imports without file extensions (airbnb rule)
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "import/newline-after-import": WARN,
    "import/no-extraneous-dependencies": OFF,
    "import/no-unresolved": OFF,
    "import/order": [
      ERROR,
      {
        alphabetize: {
          caseInsensitive: true,
          order: "asc",
        },
        groups: ["external", "builtin", "internal"],
        pathGroups: [
          {
            group: "external",
            pattern: "react",
            position: "before",
          },
          {
            group: "external",
            pattern: "@**",
            position: "before",
          },
          {
            group: "internal",
            pattern:
              "(analytics|components|constants|context|gql|hoc|hooks|pages|types|utils)/**",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
      },
    ],
    "import/prefer-default-export": OFF,

    // Rules for prettier.
    "prettier/prettier": errorIfStrict, // Makes Prettier issues warnings rather than errors.
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        paths: ["src"],
      },
    },
    react: {
      version: "detect",
    },
  },
};
