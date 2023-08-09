const { browser } = require("@bugsnag/source-maps");

browser.uploadMultiple({
  apiKey: process.env.REACT_APP_BUGSNAG_API_KEY,
  appVersion: process.env.REACT_APP_VERSION,
  overwrite: true,
  directory: "./dist/assets",
  baseUrl: `${process.env.REACT_APP_PARSLEY_URL}/assets`,
});
