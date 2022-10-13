const releaseStage = process.env.REACT_APP_RELEASE_STAGE;
const evergreenURL = process.env.REACT_APP_EVERGREEN_URL;
const logkeeperURL = process.env.REACT_APP_LOGKEEPER_URL;
const spruceURL = process.env.REACT_APP_SPRUCE_URL;

const isLocal = releaseStage === "local";
const isProduction = releaseStage === "production";
const isStaging = releaseStage === "staging";

export {
  isLocal,
  isProduction,
  isStaging,
  evergreenURL,
  logkeeperURL,
  spruceURL,
};
