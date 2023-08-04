import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";
import { LogTypes } from "constants/enums";

type Action =
  | { name: "Clicked Upload Link"; hasLogs: boolean }
  | { name: "Dropped file" }
  | { name: "Uploaded Log File With Picker" }
  | { name: "Processed Log"; logType: LogTypes; fileSize?: number };

export const useLogDropAnalytics = () => useAnalyticsRoot<Action>("LogDrop");
