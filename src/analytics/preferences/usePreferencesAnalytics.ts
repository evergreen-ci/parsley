import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";
import { FilterLogic } from "constants/enums";

type Action =
  | { name: "Opened Task Link" }
  | { name: "Opened Job Logs" }
  | { name: "Opened Legacy Job Logs" }
  | { name: "Opened Raw Logs" }
  | { name: "Opened HTML Logs" }
  | { name: "Clicked Copy To Jira" }
  | { name: "Toggled Wrap"; on: boolean }
  | { name: "Toggled Case Sensitivity"; on: boolean }
  | { name: "Toggled Pretty Print"; on: boolean }
  | { name: "Toggled Filter Logic"; logic: FilterLogic }
  | { name: "Toggled Expandable Rows"; on: boolean }
  | { name: "Toggled Zebra Stripes"; on: boolean };

export const usePreferencesAnalytics = () =>
  useAnalyticsRoot<Action>("Preferences");
