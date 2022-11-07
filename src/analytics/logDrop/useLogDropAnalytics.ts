import {
  Analytics as A,
  Properties,
  addPageAction,
} from "analytics/addPageAction";
import { LogTypes } from "constants/enums";

type Action =
  | { name: "Clicked Upload Link"; hasLogs: boolean }
  | { name: "Dropped file" }
  | { name: "Uploaded Log File With Picker" }
  | { name: "Processed Log"; logType: LogTypes };

interface P extends Properties {}
interface Analytics extends A<Action> {}

export const useLogDropAnalytics = (): Analytics => {
  const sendEvent: Analytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "LogDrop",
    });
  };

  return { sendEvent };
};
