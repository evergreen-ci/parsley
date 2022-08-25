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