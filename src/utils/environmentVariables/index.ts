const releaseStage = process.env.REACT_APP_RELEASE_STAGE;
const evergreenURL = process.env.REACT_APP_EVERGREEN_URL;
const logkeeperURL = process.env.REACT_APP_LOGKEEPER_URL;
const bugsnagAPIKey = process.env.REACT_APP_BUGSNAG_API_KEY;
const appVersion = process.env.REACT_APP_VERSION;
const isProductionBuild = process.env.NODE_ENV === "production";

const isLocal = releaseStage === "local";
const isProduction = releaseStage === "production";
const isStaging = releaseStage === "staging";

export {
  isLocal,
  isProduction,
  isStaging,
  evergreenURL,
  logkeeperURL,
  isProductionBuild,
  appVersion,
  bugsnagAPIKey,
  releaseStage,
};
