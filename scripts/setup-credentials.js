const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "../", ".env-cmdrc.json");
const production = {
  REACT_APP_EVERGREEN_URL: "https://evergreen.mongodb.com",
  REACT_APP_GRAPHQL_URL: "https://evergreen.mongodb.com/graphql/query",
  REACT_APP_LOBSTER_URL: "https://evergreen.mongodb.com/lobster",
  REACT_APP_LOGKEEPER_URL: "https://logkeeper2.build.10gen.cc",
  REACT_APP_SPRUCE_URL: "https://spruce.mongodb.com",
  REACT_APP_PARSLEY_URL: "https://parsley.mongodb.com",
  REACT_APP_RELEASE_STAGE: "production",
  BUCKET: process.env.BUCKET,
  REACT_APP_BUGSNAG_API_KEY: process.env.REACT_APP_BUGSNAG_API_KEY,
  NEW_RELIC_ACCOUNT_ID: process.env.NEW_RELIC_ACCOUNT_ID,
  NEW_RELIC_TRUST_KEY: process.env.NEW_RELIC_TRUST_KEY,
  NEW_RELIC_AGENT_ID: process.env.NEW_RELIC_AGENT_ID,
  NEW_RELIC_LICENSE_KEY: process.env.NEW_RELIC_LICENSE_KEY,
  NEW_RELIC_APPLICATION_ID: process.env.NEW_RELIC_APPLICATION_ID,
  REACT_APP_SENTRY_AUTH_TOKEN: process.env.REACT_APP_SENTRY_AUTH_TOKEN,
  REACT_APP_SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN,
  DEPLOYS_EMAIL: process.env.DEPLOYS_EMAIL,
};

fs.writeFile(file, JSON.stringify({ production }), (err) => {
  if (err) {
    console.error(err);
    throw new Error("Error while creating .env-cmdrc.json file");
  }
});
