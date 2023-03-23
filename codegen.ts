import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "sdlschema/**/*.graphql",
  // The documents field will need to be populated later in EVG-18101.
  documents: [],
  generates: {
    "./src/gql/generated/types.ts": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        arrayInputCoercion: false,
        scalars: {
          Time: "Date",
          Duration: "number",
          StringMap: "{ [key: string]: any }",
        },
      },
    },
  },
  hooks: {
    afterAllFileWrite: ["prettier --write"],
  },
};

export default config;
