import React from "react";
import Bugsnag, { Event as BugsnagEvent } from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";
import {
  getAppVersion,
  getBugsnagApiKey,
  getReleaseStage,
} from "utils/environmentVariables";
import { DefaultErrorBoundary } from "./ErrorBoundary";
import ErrorFallback from "./ErrorFallback";

const initializeBugsnag = () => {
  try {
    Bugsnag.start({
      apiKey: getBugsnagApiKey(),
      appVersion: getAppVersion(),
      plugins: [new BugsnagPluginReact()],
      releaseStage: getReleaseStage(),
    });
  } catch (e) {
    console.error("Failed to initialize Bugsnag", e);
  }
};

const fallback = () => <ErrorFallback />;

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const bugsnagPlugin = Bugsnag.getPlugin("react");

  const Boundary =
    bugsnagPlugin !== undefined
      ? bugsnagPlugin.createErrorBoundary(React)
      : DefaultErrorBoundary;

  const onError = (event: BugsnagEvent) => {
    const userId = localStorage.getItem("userId") ?? undefined;
    event.setUser(userId);
    event.addMetadata("metadata", {
      viewedErrorPage: true,
    });
  };

  return (
    <Boundary FallbackComponent={fallback} onError={onError}>
      {children}
    </Boundary>
  );
};

const sendError = (
  err: Error,
  severity: BugsnagEvent["severity"],
  metadata?: { [key: string]: any }
) => {
  const userId = localStorage.getItem("userId") ?? "";
  Bugsnag.notify(err, (event) => {
    // reassigning param is recommended usage in bugsnag docs
    // eslint-disable-next-line no-param-reassign
    event.severity = severity;
    event.setUser(userId);
    if (metadata) {
      event.addMetadata("metadata", metadata);
    }
  });
};

export { ErrorBoundary, initializeBugsnag, sendError };
