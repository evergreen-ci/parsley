import { useQuery } from "@apollo/client";
import { UserQuery, UserQueryVariables } from "gql/generated/types";
import { GET_USER } from "gql/queries";

type Options = {
  onError?: (error: Error) => void;
};

export const useUser = (options?: Options) => {
  const { data, loading } = useQuery<UserQuery, UserQueryVariables>(GET_USER, {
    onError(err) {
      options?.onError?.(err);
    },
  });
  const { user } = data || {};
  return { loading, user };
};
