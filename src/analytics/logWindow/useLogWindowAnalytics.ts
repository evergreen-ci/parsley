import { useCallback, useMemo } from "react";
import {
  Analytics as A,
  Properties,
  addPageAction,
} from "analytics/addPageAction";
import { DIRECTION } from "context/LogContext/types";
import { Filter } from "types/logs";

type Action =
  | { name: "Added Filter"; filterExpression: string }
  | { name: "Deleted Filter"; filterExpression: string }
  | { name: "Toggled Filter"; visible: boolean }
  | { name: "Added Bookmark" }
  | { name: "Navigated With Bookmark" }
  | { name: "Removed Bookmark" }
  | { name: "Cleared All Bookmarks" }
  | { name: "Edited Filter"; before: Filter; after: Filter }
  | { name: "Added Highlight"; highlightExpression: string }
  | { name: "Removed Highlight"; highlightExpression: string }
  | { name: "Applied Search"; searchExpression: string }
  | { name: "Expanded Lines"; option: "All" | "Five"; lineCount: number }
  | { name: "Collapsed Lines" }
  | { name: "Paginated Through Search Results"; direction: DIRECTION };

interface P extends Properties {}
interface Analytics extends A<Action> {}

export const useLogWindowAnalytics = (): Analytics => {
  const sendEvent: Analytics["sendEvent"] = useCallback((action) => {
    addPageAction<Action, P>(action, {
      object: "LogWindow",
    });
  }, []);

  return useMemo(() => ({ sendEvent }), [sendEvent]);
};
