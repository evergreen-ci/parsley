import {
  Analytics as A,
  Properties,
  addPageAction,
} from "analytics/addPageAction";
import { FilterLogic } from "constants/enums";

type Action =
  | { name: "Opened Task Link" }
  | { name: "Opened Job Logs" }
  | { name: "Opened Raw Logs" }
  | { name: "Opened HTML Logs" }
  | { name: "Clicked Copy To Jira" }
  | { name: "Toggle Wrap"; on: boolean }
  | { name: "Toggle Case Sensitivity"; on: boolean }
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
