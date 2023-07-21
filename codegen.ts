import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  documents: ["./src/**/*.graphql"],
  generates: {
    "./src/gql/generated/types.ts": {
      config: {
        arrayInputCoercion: false,
        scalars: {
          Duration: "number",
          StringMap: "{ [key: string]: any }",
          Time: "Date",
        },
      },
      plugins: ["typescript", "typescript-operations"],
    },
  },
  hooks: {
    afterAllFileWrite: ["prettier --write"],
  },
  schema: "sdlschema/**/*.graphql",
};

export default config;
