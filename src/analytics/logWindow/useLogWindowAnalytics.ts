import {
  Analytics as A,
  Properties,
  addPageAction,
} from "analytics/addPageAction";
import { Filter } from "types/logs";

type Action =
  | { name: "Added Filter"; filterExpression: string }
  | { name: "Deleted Filter"; filterExpression: string }
  | { name: "Toggled Filter"; visible: boolean }
  | { name: "Edited Filter"; before: Filter; after: Filter }
  | { name: "Added Highlight"; highlightExpression: string }
  | { name: "Delete Highlight"; highlightExpression: string }
  | { name: "Applied Search"; searchExpression: string }
  | { name: "Expanded Lines"; option: "All" | "Five"; lineCount: number }
  | { name: "Collapsed Lines" };

interface P extends Properties {}
interface Analytics extends A<Action> {}

export const useLogWindowAnalytics = (): Analytics => {
  const sendEvent: Analytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "LogWindow",
    });
  };

  return { sendEvent };
};
