import { useEffect } from "react";

import { useLogContext } from "context/LogContext";

export const useAnalyticAttributes = () => {
  const { logMetadata } = useLogContext();
  const { newrelic } = window;
  const { logType } = logMetadata || {};

  useEffect(() => {
    if (typeof newrelic !== "object") {
      console.debug("Setting logType: ", logType);
      return;
    }
    if (logType !== undefined) {
      newrelic.setCustomAttribute("logType", logType);
    }
  }, [logType, newrelic]);
};
