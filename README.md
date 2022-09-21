# Parsley 🌿

Parsley is the UI for Evergreen's log viewer. It will eventually replace [Lobster](https://github.com/evergreen-ci/lobster).

## Table of Contents

- [Getting Started](#getting-started)

## Getting Started

### Running Locally

1. Clone this GitHub repository.
2. Ensure you have Node.js 16.13+ and [Yarn](https://yarnpkg.com/getting-started/install) installed.
3. Ask a colleague for their .cmdrc.json file and follow the instructions [here](#environment-variables)
4. Run `yarn`.
5. Run `yarn run dev`. This will launch the app.

#### Starting supporting services

Parsley is capable of fetching logs from both [evergreen](https://github.com/evergreen-ci/evergreen) and [logkeeper](https://github.com/evergreen-ci/logkeeper). If you would like to develop against them you will need to run both of the servers locally.

**Evergreen**
1. Clone the [Evergreen Repository](https://github.com/evergreen-ci/evergreen)
2. Follow the setup instructions in the readme to set up your environment.
3. Run `make local-evergreen` to start the local evergreen server

**Logkeeper**
1. Clone the [Logkeeper Repository](https://github.com/evergreen-ci/logkeeper)
2. ```sh
    cd logkeeper
    
    # Use this (or similar command) to seed some sample data into a local bucket and use that as storage
    mkdir -p _bucketdata && cp -r testdata/simple/* _bucketdata
    ```
3. Run the following command to inject the necessary env variables and start the local logkeeper server `LK_CORS_ORIGINS=http:\/\/localhost:\\d+ go run main/logkeeper.go --localPath _bucketdata`


### Environment Variables

[env-cmd](https://github.com/toddbluhm/env-cmd#readme) is used to configure build environments for production, staging and development. This file is git ignored because it contains API keys that we do not want to publish. It should be named `.env-cmdrc.json` and placed at the root of the project. This file is required to deploy Parsley to production and to staging. Ask a team member to send you their copy of the file, which should look like the following:

```js
{
    "devLocal": {
        "REACT_APP_LOGKEEPER_URL": "devLocal",
        "REACT_APP_EVERGREEN_URL": "http://localhost:9090"
    },
    "local": {
        "REACT_APP_LOGKEEPER_URL": "devLocal",
        "REACT_APP_EVERGREEN_URL": "http://localhost:9090",
        "REACT_APP_RELEASE_STAGE": "local"
    }
}

```

## Deployment

### Requirements

You must be on the `main` Branch if deploying to prod.

A `.env-cmdrc.json` file is required to deploy because it sets the environment variables that the application needs for a given deployment environments. See [Environment Variables](#environment-variables) section for more info about this file.

### How to Deploy:

Run the `deploy:beta` or `deploy:staging` yarn command

1. `yarn deploy:beta` = deploy to https://parsley-beta.corp.mongodb.com
2. `yarn deploy:staging` = deploy to https://parsley-staging.corp.mongodb.com
