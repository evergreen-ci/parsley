import {
  Analytics as A,
  Properties,
  addPageAction,
} from "analytics/addPageAction";
import { Filter } from "types/logs";

type Action =
  | { name: "Add Filter"; filterExpression: string }
  | { name: "Deleted Filter"; filterExpression: string }
  | { name: "Toggled Filter"; visible: boolean }
  | { name: "Edited Filter"; before: Filter; after: Filter }
  | { name: "Add Highlight" }
  | { name: "Delete Highlight" }
  | { name: "Applied Search"; searchExpression: string }
  | { name: "Expand Lines"; option: "ALL" | "5Lines"; lineCount: number }
  | { name: "Collapse Lines" }
  | { name: "Open Task Link" }
  | { name: "Open Job Logs" }
  | { name: "Open Raw Logs" }
  | { name: "Open HTML Logs" };

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
