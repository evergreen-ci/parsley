# Parsley 🌿

Parsley is the UI for Evergreen's log viewer. It will eventually replace
[Lobster](https://github.com/evergreen-ci/lobster).

## Table of Contents

- [Getting Started](#getting-started)

## Getting Started

### Running Locally

1. Clone this GitHub repository.
2. Ensure you have Node.js 16.13+ and
   [Yarn](https://yarnpkg.com/getting-started/install) installed.
3. Ask a colleague for their .cmdrc.json file and follow the instructions
   [here](#environment-variables)
4. Run `yarn`.
5. Run `yarn run dev`. This will launch the app.

### Starting supporting services

Parsley is capable of fetching logs from both
[evergreen](https://github.com/evergreen-ci/evergreen) and
[logkeeper](https://github.com/evergreen-ci/logkeeper). If you would like to
develop against them you will need to run both of the servers locally.

**Evergreen**

1. Clone the [Evergreen Repository](https://github.com/evergreen-ci/evergreen)
2. Follow the setup instructions in the README to set up your environment.
3. Run `make local-evergreen` to start the local evergreen server

**Logkeeper**

1. Clone the [Logkeeper Repository](https://github.com/evergreen-ci/logkeeper)
2. Run `yarn bootstrap-logkeeper` to download some sample resmoke logs from s3.
3. Run the command outputted by the previous step to seed the env variables and
   start the local logkeeper server

   ```bash
   LK_CORS_ORIGINS=http:\/\/localhost:\\d+ LK_EVERGREEN_ORIGIN=http://localhost:8080 LK_PARSLEY_ORIGIN=http://localhost:5173 go run main/logkeeper.go --localPath {abs_path_to_parsley}/bin/_bucketdata
   ```

   Note that all log output is piped to a file named `logkeeperapp.log`. You can
   use `tail -f logkeeperapp.log` to view the log output.

### GraphQL Type Generation

To be able to use code generation, you'll need to create a symlink to the
`schema` folder in Evergreen. This folder contains the definitions for our
GraphQL queries, mutations, and types.

To create a symlink, run the following command:

```
ln -s <path_to_evergreen_repo>/graphql/schema sdlschema
```

### Environment Variables

[env-cmd](https://github.com/toddbluhm/env-cmd#readme) is used to configure
build environments for production, staging and development. We use two files to
represent these various environments: `.cmdrc-local.json` for local builds with
non-sensitive information, and `.env-cmdrc.json` for builds deployed to S3. This
file is git ignored because it contains API keys that we do not want to publish.
It should be named `.env-cmdrc.json` and placed at the root of the project. This
file is required to deploy Parsley to production and to staging. The credential
file is located in the R&D Dev Prod 1password vault.

## Deployment

### Requirements

You must be on the `main` Branch if deploying to prod.

A `.env-cmdrc.json` file is required to deploy because it sets the environment
variables that the application needs for a given deployment environments. See
[Environment Variables](#environment-variables) section for more info about this
file.

### How to Deploy:

Run the `deploy:<env>` yarn command

- `yarn deploy:prod` = deploy to https://parsley.mongodb.com
  - Deploying to production involves following the prompts in the cli command
    which kicks off an evergreen task that performs the deploy
- `yarn deploy:beta` = deploy to https://parsley-beta.corp.mongodb.com
- `yarn deploy:staging` = deploy to https://parsley-staging.corp.mongodb.com
