import { useEffect } from "react";
// @ts-expect-error
import NewRelicAPI from "new-relic-browser";
import { useLogContext } from "context/LogContext";

declare global {
  interface Window {
    newrelic: typeof NewRelicAPI; // eslint-disable-line no-undef
  }
}

export const useAnalyticAttributes = () => {
  const { logMetadata } = useLogContext();
  const { newrelic } = window;
  const { logType } = logMetadata || {};

  useEffect(() => {
    if (typeof newrelic !== "object") {
      console.debug("Setting logType: ", logType);
      return;
    }
    if (logType !== null) {
      newrelic.setCustomAttribute("logType", logType);
    }
  }, [logType, newrelic]);
};
