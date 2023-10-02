import Bugsnag from "@bugsnag/js";
import { isProductionBuild } from "utils/environmentVariables";
import { initializeBugsnag } from "./Bugsnag";
import { initializeSentry, isInitialized } from "./Sentry";

export const initializeErrorHandling = () => {
  if (!isProductionBuild()) {
    return;
  }

  if (!Bugsnag.isStarted()) {
    initializeBugsnag();
  }

  if (!isInitialized()) {
    initializeSentry();
  }
};
