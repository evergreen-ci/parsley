import { MockedProvider } from "@apollo/client/testing";
import { act, waitFor } from "@testing-library/react";
import { QueryParams } from "constants/queryParams";
import { LogContextProvider, useLogContext } from "context/LogContext";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  ParsleySettingsQuery,
  ParsleySettingsQueryVariables,
} from "gql/generated/types";
import { PARSLEY_SETTINGS } from "gql/queries";
import { useQueryParam } from "hooks/useQueryParam";
import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import { renderComponentWithHook } from "test_utils/TestHooks";
import { ApolloMock } from "types/gql";
import DetailsMenu from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[parsleySettingsMock]}>
    <LogContextProvider initialLogLines={logs}>{children}</LogContextProvider>
  </MockedProvider>
);

const logs = [
  "line 1",
  "line 2",
  "line 3",
  "line 4",
  "line 5",
  "line 6",
  "line 7",
];
/**
 * `renderSharingMenu` renders the sharing menu with the default open prop
 * @returns - hook and utils
 */
const renderDetailsMenu = () => {
  const useCombinedHook = () => ({
    useLogContext: useLogContext(),
    useQueryParam: useQueryParam<number | undefined>(
      QueryParams.UpperRange,
      undefined,
    ),
  });
  const { Component: MenuComponent, hook } = renderComponentWithHook(
    useCombinedHook,
    <DetailsMenu disabled={false} />,
  );
  const { Component } = RenderFakeToastContext(<MenuComponent />);
  const utils = render(<Component />, { wrapper });
  return {
    hook,
    utils,
  };
};

describe("detailsMenu", () => {
  it("should render a details menu button", () => {
    renderDetailsMenu();
    expect(screen.getByText("Details")).toBeInTheDocument();
  });
  it("clicking on the details menu button should open the details menu", async () => {
    const user = userEvent.setup();

    renderDetailsMenu();
    expect(screen.queryByDataCy("details-menu")).not.toBeInTheDocument();
    const detailsButton = screen.getByRole("button", {
      name: "Details",
    });
    expect(detailsButton).toBeEnabled();
    await user.click(detailsButton);
    expect(screen.getByDataCy("details-menu")).toBeInTheDocument();
  });
  it("updating search range should flash the details button", async () => {
    jest.useFakeTimers();

    const { hook } = renderDetailsMenu();
    expect(screen.queryByDataCy("details-menu")).not.toBeInTheDocument();
    const detailsButton = screen.getByRole("button", {
      name: "Details",
    });
    expect(detailsButton).toBeEnabled();
    expect(detailsButton).toHaveAttribute("data-variant", "default");
    act(() => {
      hook.current.useQueryParam[1](1);
    });
    expect(detailsButton).toHaveAttribute("data-variant", "primary");
    jest.runAllTimers();
    await waitFor(() => {
      expect(detailsButton).toHaveAttribute("data-variant", "default");
    });
  });
});

const parsleySettingsMock: ApolloMock<
  ParsleySettingsQuery,
  ParsleySettingsQueryVariables
> = {
  request: {
    query: PARSLEY_SETTINGS,
  },
  result: {
    data: {
      user: {
        __typename: "User",
        parsleySettings: {
          __typename: "ParsleySettings",
          sectionsEnabled: true,
        },
        userId: "me",
      },
    },
  },
};
