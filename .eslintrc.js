const ERROR = "error";
const WARN = "warn";
const OFF = "off";

const errorIfStrict = process.env.STRICT ? ERROR : WARN;

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:react/recommended",
    // Airbnb includes some helpful rules for ESLint and React that aren't covered by recommended.
    // See https://github.com/airbnb/javascript/tree/master/packages for specific rules.
    "airbnb",
    "plugin:prettier/recommended", // Note: prettier must ALWAYS be the last extension.
  ],
  plugins: ["@typescript-eslint"],
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      node: {
        paths: ["src"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  rules: {
    // Rules for ESLint.
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
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: true,
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
        groups: ["external", "builtin", "internal"],
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
          {
            pattern: "@**",
            group: "external",
            position: "before",
          },
          {
            pattern:
              "(analytics|components|constants|context|gql|hoc|hooks|pages|types|utils)/**",
            group: "internal",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    "import/prefer-default-export": OFF,

    // Rules for prettier.
    "prettier/prettier": errorIfStrict, // Makes Prettier issues warnings rather than errors.
  },
  overrides: [
    {
      files: ["cypress/**/*.ts"],
      extends: ["plugin:cypress/recommended"],
    },
  ],
};
