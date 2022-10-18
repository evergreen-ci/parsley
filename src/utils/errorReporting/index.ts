import Bugsnag, { BreadcrumbType, Event, NotifiableError } from "@bugsnag/js";
import { isProductionBuild } from "utils/environmentVariables";

interface reportErrorResult {
  severe: () => void;
  warning: () => void;
}

type CustomBugsnagError = NotifiableError & {
  metadata?: any;
};

const reportError = (err: CustomBugsnagError): reportErrorResult => {
  if (!isProductionBuild) {
    return {
      severe: () => {
        console.error({ err, severity: "severe" });
      },
      warning: () => {
        console.error({ err, severity: "warning" });
      },
    };
  }

  return {
    severe: () => {
      sendError(err, "error");
    },
    warning: () => {
      sendError(err, "warning");
    },
  };
};

const sendError = (err: CustomBugsnagError, severity: Event["severity"]) => {
  let metadata: { [key: string]: any } = {};
  if (err.metadata) {
    metadata = err.metadata;
  }
  Bugsnag.notify(err, (event) => {
    // reassigning param is recommended usage in bugsnag docs
    // eslint-disable-next-line no-param-reassign
    event.severity = severity;
    if (metadata) {
      event.addMetadata("metadata", { ...metadata });
    }
  });
};

const leaveBreadcrumb = (
  message: string,
  metadata: { [key: string]: any },
  type: BreadcrumbType
) => {
  if (!isProductionBuild) {
    console.debug({ message, metadata, type });
  } else {
    Bugsnag.leaveBreadcrumb(message, metadata, type);
  }
};

export { leaveBreadcrumb, reportError };
