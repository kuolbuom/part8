import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import {
  ApolloClient,
  ApolloLink,
  gql,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";

import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

//using this made the client accessible for all components of the application by wrapping the App with it
import { ApolloProvider } from "@apollo/client/react";

//frontend is sending the JWT token to the backend.
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("library-user-token");

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  });

  return forward(operation);
});

//client constructor
//the code creates a new client object, which is then used to send a query to the server
const httpLink = new HttpLink({
  uri: "http://127.0.0.1:4000/graphql",
});

//create the WebSocket link
const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://127.0.0.1:4000/graphql",
  }),
);

//Then we use split() to tell Apollo: If this operation is a subscription, use WebSocket. Otherwise use HTTP.
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

//expected data
//A gql tag is added before the template literal that forms the query
const query = gql`
  query {
    allAuthors {
      id
      name
      born
      bookCount
    }

    allBooks {
      id
      title
      author {
        name
      }
      published
    }
  }
`;

client.query({ query }).then((response) => {
  console.log("data from server", response.data);
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
);
