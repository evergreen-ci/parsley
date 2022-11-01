import {
  Analytics as A,
  Properties,
  addPageAction,
} from "analytics/addPageAction";
import { FilterLogic } from "constants/enums";

type Action =
  | { name: "Open Task Link" }
  | { name: "Open Job Logs" }
  | { name: "Open Raw Logs" }
  | { name: "Open HTML Logs" }
  | { name: "Clicked Copy To Jira" }
  | { name: "Toggle Wrap"; on: boolean }
  | { name: "Toggle Case Sensitivity"; insensitive: boolean }
  | { name: "Toggle Pretty Print"; on: boolean }
  | { name: "Toggle Filter Logic"; logic: FilterLogic }
  | { name: "Toggle Expandable Rows"; on: boolean };

interface P extends Properties {}
interface Analytics extends A<Action> {}

export const usePreferencesAnalytics = (): Analytics => {
  const sendEvent: Analytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "Preferences",
    });
  };

  return { sendEvent };
};
