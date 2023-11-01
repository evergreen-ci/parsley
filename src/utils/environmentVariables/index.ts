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

const getReleaseStage = () => process.env.REACT_APP_RELEASE_STAGE || "";
const getSentryDSN = () => process.env.REACT_APP_SENTRY_DSN || "";

const isLocal = () => getReleaseStage() === ReleaseStage.Local;
const isStaging = () => getReleaseStage() === ReleaseStage.Staging;
const isProduction = () => getReleaseStage() === ReleaseStage.Production;

const isProductionBuild = () => process.env.NODE_ENV === Environment.Production;
const isDevelopmentBuild = () =>
  isLocal() || process.env.NODE_ENV === Environment.Development;

const evergreenURL = process.env.REACT_APP_EVERGREEN_URL;
const graphqlURL = process.env.REACT_APP_GRAPHQL_URL;
const lobsterURL = process.env.REACT_APP_LOBSTER_URL;
const logkeeperURL = process.env.REACT_APP_LOGKEEPER_URL;
const spruceURL = process.env.REACT_APP_SPRUCE_URL;

export {
  isLocal,
  isStaging,
  isProduction,
  isProductionBuild,
  isDevelopmentBuild,
  evergreenURL,
  graphqlURL,
  lobsterURL,
  logkeeperURL,
  spruceURL,
  getReleaseStage,
  getSentryDSN,
};
