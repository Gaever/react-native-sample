import {
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client/core';
import {onError} from '@apollo/client/link/error';
import {getMainDefinition} from '@apollo/client/utilities';
// import { TokenRefreshLink } from "apollo-link-token-refresh";
// import fetch from "cross-fetch";
// import { createClient as createWsClient } from "graphql-ws";
// import * as setCookie from "set-cookie-parser";
// import WebSocket from "ws";
import {WebSocketLink} from '@apollo/client/link/ws';

interface GraphqlClientCtx {
  getAuthJwt?: () => string;
  gqlHttpUri: string;
  gqlWsUri?: string;
  hasuraAdminSecret?: string;
  refreshTokenUrl?: string;
  logout?: () => void;
  onTokenExpired?: () => void;
  onUpdateAuthToken?: (args: {
    refreshJwt: string | undefined;
    authJwt: string | undefined;
  }) => void;
}

const httpLink = (ctx: GraphqlClientCtx) => {
  if (!ctx.gqlHttpUri) throw new Error('!ctx.gqlHttpUri');
  if (!ctx.getAuthJwt) throw new Error('!ctx.getAuthJwt');
  const authJwt = ctx.getAuthJwt();

  return new HttpLink({
    uri: ctx.gqlHttpUri,
    ...(authJwt
      ? {headers: {Authorization: `Bearer ${ctx.getAuthJwt()}`}}
      : null),
  });
};

const wsLink = (ctx: GraphqlClientCtx) => {
  if (!ctx.gqlWsUri) throw new Error('!ctx.gqlWsUri');
  if (!ctx.getAuthJwt) throw new Error('!ctx.getAuthJwt');
  const authJwt = ctx.getAuthJwt();
  return new WebSocketLink({
    uri: ctx.gqlWsUri,
    options: {
      reconnect: true,
      ...(authJwt
        ? {
            connectionParams: {
              headers: {Authorization: `Bearer ${ctx.getAuthJwt()}`},
            },
          }
        : null),
    },
  });
};

const splitLink = (ctx: GraphqlClientCtx) =>
  split(
    ({query}) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink(ctx),
    httpLink(ctx),
  );

const authLink = (ctx: GraphqlClientCtx) => {
  if (!ctx.getAuthJwt) throw new Error('!ctx.getAuthJwt');

  return new ApolloLink((operation, forward) => {
    const token = ctx.getAuthJwt!();

    operation.setContext(({headers}: {headers: any}) => ({
      headers: {
        ...headers,
        ...(token ? {Authorization: `Bearer ${token}`} : null),
      },
    }));

    return forward(operation);
  });
};

const errorLink = (ctx: GraphqlClientCtx) =>
  onError(({graphQLErrors, networkError, operation, forward, ...rest}) => {
    let isStaleToken = false;
    if (graphQLErrors)
      graphQLErrors.forEach(({message, locations, path}) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          {
            variables: JSON.stringify(operation.variables, null, 2),
            query: JSON.stringify(operation.query, null, 2),
          },
        );
        if (/JWT/gim.test(message)) {
          isStaleToken = true;
        }
      });
    if (networkError) {
      console.error('[Network error]', networkError);
      if (/JWT/gim.test(networkError?.message)) {
        isStaleToken = true;
      }
    }

    // @ts-expect-error
    const statusCode = networkError?.statusCode as number;

    if (statusCode === 401) {
      isStaleToken = true;
    }

    if (isStaleToken) {
      operation.setContext({isStaleToken: true});
      ctx.onTokenExpired?.();
    } else {
      forward(operation);
    }
  });

// const tokenRefreshLink = (ctx: GraphqlClientCtx) => {
//   if (!ctx.refreshTokenUrl) throw new Error("!ctx.refreshTokenUrl");
//   if (!ctx.logout) throw new Error("!ctx.logout");
//   if (!ctx.onUpdateAuthToken) throw new Error("!ctx.onUpdateAuthToken");

//   return new TokenRefreshLink({
//     accessTokenField: "token",
//     isTokenValidOrUndefined: (operation) => !!operation.getContext().isStaleToken,
//     fetchAccessToken: () => fetch(ctx.refreshTokenUrl!),
//     handleFetch: (token, operation) => {
//       operation.setContext(({ headers }: { headers: any }) => ({
//         headers: {
//           ...headers,
//           ...(token ? { Authorization: `Bearer ${token}` } : null),
//         },
//       }));
//     },
//     handleResponse: () => async (response: Response) => {
//       if (response.status > 201) {
//         ctx.logout!();
//         return { token: "" };
//       }

//       const json = await response.json();
//       if (!json?.token) {
//         ctx.logout!();
//         return { token: "" };
//       }

//       const responseCookie = setCookie.parse(response.headers.get("set-cookie") || "");
//       const refreshJwt = responseCookie.find((item) => item.name === "refresh-jwt")?.value;

//       ctx.onUpdateAuthToken!({ refreshJwt, authJwt: json.token });

//       return { token: json.token };
//     },
//     handleError: (err) => {
//       // full control over handling token fetch Error
//       console.warn("Your refresh token is invalid. Try to relogin");
//       console.error(err);

//       if (typeof navigator !== "undefined") {
//         if (navigator.onLine) {
//           ctx.logout!();
//         }
//       } else {
//         ctx.logout!();
//       }
//     },
//   });
// };

const debugLink = new ApolloLink((operation, forward) => {
  return forward(operation);
});

export const apolloClient = (ctx: GraphqlClientCtx) =>
  new ApolloClient({
    link: from([
      /*errorLink,*/ /*tokenRefreshLink(ctx),*/ /*debugLink,*/ errorLink(ctx),
      splitLink(ctx),
    ]),

    // link: splitLink(ctx),
    cache: new InMemoryCache(),
    defaultOptions: {
      mutate: {
        fetchPolicy: 'no-cache',
      },
      query: {
        fetchPolicy: 'no-cache',
      },
    },
  });
