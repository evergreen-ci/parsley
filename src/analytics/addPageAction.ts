// @ts-expect-error
import type { NewRelicAPI } from "new-relic-browser";
import { parseQueryString } from "utils/query-string";

declare global {
  interface Window {
    newrelic: typeof NewRelicAPI; // eslint-disable-line no-undef
  }
}

export interface Analytics<Action> {
  sendEvent: (action: Action) => void;
}

type AnalyticsObject = "LogDrop" | "LogWindow";

interface RequiredProperties {
  object: AnalyticsObject;
}
interface ActionType {
  name: string;
}

export interface Properties {
  [key: string]: string | number;
}

export const addPageAction = <A extends ActionType, P extends Properties>(
  { name, ...actionProps }: A,
  properties: P & RequiredProperties
) => {
  const { newrelic } = window;
  const { search } = window.location;
  const attributesToSend = {
    ...properties,
    ...parseQueryString(search),
    ...actionProps,
  };

  if (typeof newrelic !== "object") {
    // These will only print when new relic is not available such as during local development
    console.log("ANALYTICS EVENT ", { name, attributesToSend });
    return;
  }

  newrelic.addPageAction(name, attributesToSend);
};