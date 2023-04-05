enum ReleaseStage {
  Local = "local",
  Staging = "staging",
  Beta = "beta",
  Production = "production",
}

enum Environment {
  Development = "development",
  Production = "production",
}

const appVersion = process.env.REACT_APP_VERSION;
const releaseStage = process.env.REACT_APP_RELEASE_STAGE;

const isLocal = releaseStage === ReleaseStage.Local;
const isStaging = releaseStage === ReleaseStage.Staging;
const isProduction = releaseStage === ReleaseStage.Production;
const isProductionBuild = process.env.NODE_ENV === Environment.Production;
const isDevelopment = () =>
  isLocal || process.env.NODE_ENV === Environment.Development;

const evergreenURL = process.env.REACT_APP_EVERGREEN_URL;
const graphqlURL = process.env.REACT_APP_GRAPHQL_URL;
const lobsterURL = process.env.REACT_APP_LOBSTER_URL;
const logkeeperURL = process.env.REACT_APP_LOGKEEPER_URL;
const spruceURL = process.env.REACT_APP_SPRUCE_URL;

const bugsnagAPIKey = process.env.REACT_APP_BUGSNAG_API_KEY;

export {
  appVersion,
  releaseStage,
  isLocal,
  isStaging,
  isProduction,
  isProductionBuild,
  isDevelopment,
  evergreenURL,
  graphqlURL,
  lobsterURL,
  logkeeperURL,
  spruceURL,
  bugsnagAPIKey,
};
