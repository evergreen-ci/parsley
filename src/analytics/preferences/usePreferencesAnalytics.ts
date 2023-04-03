import { useCallback, useMemo } from "react";
import {
  Analytics as A,
  Properties,
  addPageAction,
} from "analytics/addPageAction";
import { FilterLogic } from "constants/enums";

type Action =
  | { name: "Opened Task Link" }
  | { name: "Opened Job Logs" }
  | { name: "Opened Legacy Job Logs" }
  | { name: "Opened Raw Logs" }
  | { name: "Opened HTML Logs" }
  | { name: "Opened Lobster Logs" }
  | { name: "Clicked Copy To Jira" }
  | { name: "Toggled Wrap"; on: boolean }
  | { name: "Toggled Case Sensitivity"; on: boolean }
  | { name: "Toggled Pretty Print"; on: boolean }
  | { name: "Toggled Filter Logic"; logic: FilterLogic }
  | { name: "Toggled Expandable Rows"; on: boolean };

interface P extends Properties {}
interface Analytics extends A<Action> {}

export const usePreferencesAnalytics = (): Analytics => {
  const sendEvent: Analytics["sendEvent"] = useCallback((action) => {
    addPageAction<Action, P>(action, {
      object: "Preferences",
    });
  }, []);

  return useMemo(() => ({ sendEvent }), [sendEvent]);
};
