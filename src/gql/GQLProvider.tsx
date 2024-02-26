import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { graphqlURL } from "utils/environmentVariables";
import { reportError } from "utils/errorReporting";

const logErrorsLink = onError(({ graphQLErrors, operation }) => {
  if (Array.isArray(graphQLErrors)) {
    graphQLErrors.forEach((gqlErr) => {
      const fingerprint = [operation.operationName];
      if (gqlErr?.path?.length) {
        fingerprint.push(...gqlErr.path);
      }
      reportError(new Error(gqlErr.message), {
        context: {
          gqlErr,
          variables: operation.variables,
        },
        fingerprint,
        tags: { operationName: operation.operationName },
      }).warning();
    });
  }
});

const retryLink = new RetryLink({
  attempts: {
    max: 5,
    retryIf: (error): boolean =>
      error && error.response && error.response.status >= 500,
  },
  delay: {
    initial: 300,
    jitter: true,
    max: 3000,
  },
});

interface ClientLinkParams {
  credentials?: string;
  gqlURL?: string;
}

const getGQLClient = ({ credentials, gqlURL }: ClientLinkParams) => {
  const cache = new InMemoryCache();
  const link = new HttpLink({
    credentials,
    uri: gqlURL,
  });
  const client = new ApolloClient({
    cache,
    link: from([logErrorsLink, retryLink, link]),
  });
  return client;
};

const GQLProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ApolloProvider
    client={getGQLClient({
      credentials: "include",
      gqlURL: graphqlURL,
    })}
  >
    {children}
  </ApolloProvider>
);

export default GQLProvider;
