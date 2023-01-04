import {
  Analytics as A,
  Properties,
  addPageAction,
} from "analytics/addPageAction";

type Action = { name: "Used Shortcut"; keys: string };

interface P extends Properties {}
interface Analytics extends A<Action> {}

export const useShortcutAnalytics = (): Analytics => {
  const sendEvent: Analytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "Shortcut",
    });
  };

  return { sendEvent };
};
