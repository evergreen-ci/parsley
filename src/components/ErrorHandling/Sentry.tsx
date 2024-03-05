import {
  ErrorBoundary as SentryErrorBoundary,
  captureException,
  getClient,
  init,
  setTags,
  withScope,
} from "@sentry/react";
import type { Scope, SeverityLevel } from "@sentry/react";
import type { Context, Primitive } from "@sentry/types";
import {
  getReleaseStage,
  getSentryDSN,
  isProduction,
} from "utils/environmentVariables";
import ErrorFallback from "./ErrorFallback";

const initializeSentry = () => {
  try {
    init({
      debug: !isProduction(),
      dsn: getSentryDSN(),
      environment: getReleaseStage() || "development",
      normalizeDepth: 5,
    });
  } catch (e) {
    console.error("Failed to initialize Sentry", e);
  }
};

const isInitialized = () => !!getClient();

export type ErrorInput = {
  err: Error;
  fingerprint?: string[];
  context?: Context;
  severity: SeverityLevel;
  tags?: { [key: string]: Primitive };
};

const sendError = ({
  context,
  err,
  fingerprint,
  severity,
  tags,
}: ErrorInput) => {
  withScope((scope) => {
    setScope(scope, { context, level: severity });

    if (fingerprint) {
      // A custom fingerprint allows for more intelligent grouping
      scope.setFingerprint(fingerprint);
    }

    if (tags) {
      // Apply tags, which are a searchable/filterable property
      setTags(tags);
    }

    captureException(err);
  });
};

type ScopeOptions = {
  level?: SeverityLevel;
  context?: Context;
};

const setScope = (scope: Scope, { context, level }: ScopeOptions = {}) => {
  const userId = localStorage.getItem("userId") ?? undefined;
  scope.setUser({ id: userId });

  if (level) scope.setLevel(level);
  if (context) scope.setContext("metadata", context);
};

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <SentryErrorBoundary
    beforeCapture={(scope) => {
      setScope(scope);
    }}
    fallback={<ErrorFallback />}
  >
    {children}
  </SentryErrorBoundary>
);

export { ErrorBoundary, initializeSentry, isInitialized, sendError };
