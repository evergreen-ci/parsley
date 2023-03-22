const appVersion = process.env.REACT_APP_VERSION;
const releaseStage = process.env.REACT_APP_RELEASE_STAGE;

const evergreenURL = process.env.REACT_APP_EVERGREEN_URL;
const graphqlURL = process.env.REACT_APP_GRAPHQL_URL;
const lobsterURL = process.env.REACT_APP_LOBSTER_URL;
const logkeeperURL = process.env.REACT_APP_LOGKEEPER_URL;
const spruceURL = process.env.REACT_APP_SPRUCE_URL;

const bugsnagAPIKey = process.env.REACT_APP_BUGSNAG_API_KEY;

const isLocal = releaseStage === "local";
const isProduction = releaseStage === "production";
const isProductionBuild = process.env.NODE_ENV === "production";
const isStaging = releaseStage === "staging";

export {
  appVersion,
  bugsnagAPIKey,
  isLocal,
  isProduction,
  isProductionBuild,
  isStaging,
  evergreenURL,
  graphqlURL,
  lobsterURL,
  logkeeperURL,
  releaseStage,
  spruceURL,
};
