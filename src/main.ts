import { createApp, h, provide } from "vue";
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  split,
} from "@apollo/client/core";
import { getMainDefinition } from "@apollo/client/utilities";
import typeDefs from "./graphql/typeDefs.gql";
import FAVORITE_BOOKS_QUERY from "./graphql/favoriteBooks.query.gql";

import { DefaultApolloClient } from "@vue/apollo-composable";

// MEMO: WebSocketLinkは非推奨だけどサーバー側がgraphql-wsによるSubscriptions実装ではないので使う
import { WebSocketLink } from "@apollo/client/link/ws";
// 本来は以下を使いたい
// import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
// import { createClient } from "graphql-ws";
// ref. https://www.apollographql.com/docs/react/api/link/apollo-link-subscriptions/

import "./style.css";
import App from "./App.vue";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
  },
});
// const wsLink = new GraphQLWsLink(
//   createClient({
//     url: "ws://localhost:4000/subscriptions",
//   })
// );

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const cache = new InMemoryCache();

cache.writeQuery({
  query: FAVORITE_BOOKS_QUERY,
  data: {
    favoriteBooks: [
      {
        __typename: "Book",
        title: "My favorite book",
        id: 1234,
        rating: 5,
      },
    ],
  },
});

const apolloClient = new ApolloClient({
  link: splitLink,
  cache,
  typeDefs,
  connectToDevTools: true,
});

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App),
});
app.mount("#app");
