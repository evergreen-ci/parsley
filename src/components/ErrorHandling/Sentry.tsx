import {
  Replay,
  ErrorBoundary as SentryErrorBoundary,
  captureException,
  getCurrentHub,
  init,
  withScope,
} from "@sentry/react";
import type { Scope, SeverityLevel } from "@sentry/react";
import {
  getReleaseStage,
  getSentryDSN,
  isProduction,
} from "utils/environmentVariables";
import ErrorFallback from "./ErrorFallback";

const initializeSentry = () => {
  const productionEnv = isProduction();
  try {
    init({
      debug: !productionEnv,
      dsn: getSentryDSN(),
      environment: getReleaseStage() || "development",
      integrations: [
        new Replay({
          blockAllMedia: productionEnv,
          maskAllInputs: productionEnv,
          maskAllText: productionEnv,
        }),
      ],
      normalizeDepth: 5,
      replaysOnErrorSampleRate: productionEnv ? 0.6 : 1.0,
      replaysSessionSampleRate: 0,
    });
  } catch (e) {
    console.error("Failed to initialize Sentry", e);
  }
};

const isInitialized = () => !!getCurrentHub().getClient();

const sendError = (
  err: Error,
  severity: SeverityLevel,
  metadata?: { [key: string]: any }
) => {
  withScope((scope) => {
    setScope(scope, { context: metadata, level: severity });
    captureException(err);
  });
};

type ScopeOptions = {
  level?: SeverityLevel;
  context?: { [key: string]: any };
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
