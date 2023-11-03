import { isProductionBuild } from "utils/environmentVariables";
import { initializeSentry, isInitialized } from "./Sentry";

export const initializeErrorHandling = () => {
  if (!isProductionBuild()) {
    return;
  }

  if (!isInitialized()) {
    initializeSentry();
  }
};
