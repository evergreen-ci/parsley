import React from "react";
import { Decorator, Parameters } from "@storybook/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { GlobalStyles } from "../src/components/styles";
import { LogContextProvider } from "../src/context/LogContext";

export const parameters: Parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
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
];
