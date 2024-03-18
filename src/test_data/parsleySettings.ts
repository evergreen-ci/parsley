import {
  ParsleySettingsQuery,
  ParsleySettingsQueryVariables,
} from "gql/generated/types";
import { PARSLEY_SETTINGS } from "gql/queries";
import { ApolloMock } from "types/gql";

export const parsleySettingsMock: ApolloMock<
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
