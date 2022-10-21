const { browser } = require("@bugsnag/source-maps");

console.log(process.env);
browser.uploadMultiple({
  apiKey: process.env.REACT_APP_BUGSNAG_API_KEY,
  appVersion: process.env.REACT_APP_VERSION,
  overwrite: true,
  directory: "./dist/assets",
  baseUrl: `${process.env.REACT_APP_SPRUCE_URL}/assets`,
});
