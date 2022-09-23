import {
  act,
  fireEvent,
  queries,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import type { RenderOptions, RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import {
  // Refer to https://reactrouter.com/docs/en/v6/routers/history-router to understand
  // why this import is marked as unstable.
  unstable_HistoryRouter as HistoryRouter,
  Route,
  Routes,
} from "react-router-dom";
import * as customQueries from "./queries";

type QueriesType = typeof queries;
type CustomQueriesType = typeof customQueries;
type CustomRenderType = CustomQueriesType & QueriesType;
type CustomRenderOptions = RenderOptions<CustomRenderType>;

interface RenderWithRouterMatchOptions extends CustomRenderOptions {
  route?: string;
  history?: any;
  path?: string;
}

// Bind our custom queries to screen.
// https://github.com/testing-library/dom-testing-library/issues/516
const boundQueries = within<typeof customQueries>(document.body, customQueries);
const customScreen = { ...screen, ...boundQueries };

/**
 * `customRender` or `render` takes an instance of react-testing-library's render method
 *  and adds additional selectors for querying components in tests.
 * */
const customRender = (ui: React.ReactElement, options?: CustomRenderOptions) =>
  render(ui, {
    queries: { ...queries, ...customQueries },
    ...options,
  }) as RenderResult<CustomRenderType>;

const customWithin = (ui: HTMLElement) =>
  within(ui, { ...queries, ...customQueries });

/**
 * `renderWithRouterMatch` implements the `customRender` method and wraps a component
 *  with an instance of `react-router`'s `<Router />` component.
 */
const renderWithRouterMatch = (
  ui: React.ReactElement,
  options: RenderWithRouterMatchOptions = {}
) => {
  const {
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] }),
    path = "/",
    ...rest
  } = options;
  const { rerender, ...renderRest } = customRender(
    <HistoryRouter history={history}>
      <Routes>
        <Route element={ui} path={path} />
      </Routes>
    </HistoryRouter>,
    rest
  );
  const customRerender = (element: React.ReactElement) => {
    rerender(
      <HistoryRouter history={history}>
        <Routes>
          <Route element={element} path={path} />
        </Routes>
      </HistoryRouter>
    );
  };
  return {
    history,
    rerender: customRerender,
    ...renderRest,
  };
};

export {
  act,
  customScreen as screen,
  customRender as render,
  customWithin as within,
  renderWithRouterMatch,
  waitFor,
  userEvent,
  fireEvent,
};
