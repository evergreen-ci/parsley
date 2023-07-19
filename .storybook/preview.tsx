import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { Decorator, Parameters } from "@storybook/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
// This is required for storyshots https://github.com/lifeiscontent/storybook-addon-apollo-client/issues/16
import { WithApolloClient } from "storybook-addon-apollo-client/dist/decorators";
import { GlobalStyles } from "../src/components/styles";
import { LogContextProvider } from "../src/context/LogContext";
import { ToastProvider } from "../src/context/toast";

export const parameters: Parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  apolloClient: {
    MockedProvider,
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators: Decorator[] = [
  (Story: () => JSX.Element) => (
    <>
      <GlobalStyles />
      <Story />
    </>
  ),
  (Story: () => JSX.Element) => (
    <LogContextProvider>
      <Story />
    </LogContextProvider>
  ),
  (Story: () => JSX.Element) => (
    <ToastProvider>
      <Story />
    </ToastProvider>
  ),
  (Story: () => JSX.Element) => {
    const routes = [
      {
        path: "/",
        element: <Story />,
        errorElement: <div>Failed to render component.</div>,
      },
    ];
    const memoryRouter = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });
    return <RouterProvider router={memoryRouter} />;
  },
  WithApolloClient as any,
];
