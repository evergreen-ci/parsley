import Bugsnag, { BreadcrumbType, Event, NotifiableError } from "@bugsnag/js";
import { isLocal, isProductionBuild } from "utils/environmentVariables";

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
  const metadata = err.metadata || {};
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
  metadata?: { [key: string]: any },
  type?: BreadcrumbType
) => {
  const breadcrumbType = type || "manual";
  if (!isProductionBuild || isLocal) {
    console.debug({ message, metadata, breadcrumbType });
  } else {
    Bugsnag.leaveBreadcrumb(message, metadata, breadcrumbType);
  }
};

export { leaveBreadcrumb, reportError };
