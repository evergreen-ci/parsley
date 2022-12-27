import {
  Analytics as A,
  Properties,
  addPageAction,
} from "analytics/addPageAction";
import { LogTypes } from "constants/enums";

type Action =
  | { name: "Log Downloaded"; duration: number; type: LogTypes }
  | { name: "Log Download Failed"; duration: number };

interface P extends Properties {}
interface Analytics extends A<Action> {}

export const useLoadingPageAnalytics = (): Analytics => {
  const sendEvent: Analytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "LoadingPage",
    });
  };

  return { sendEvent };
};
