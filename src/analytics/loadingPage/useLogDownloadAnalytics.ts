import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";
import { LogTypes } from "constants/enums";

type Action =
  | {
      name: "Log Downloaded";
      duration: number;
      type: LogTypes;
      fileSize: number;
    }
  | {
      name: "Log Download Failed";
      duration: number;
      type: LogTypes;
      fileSize: number;
    };

export const useLogDownloadAnalytics = () =>
  useAnalyticsRoot<Action>("LoadingPage");
