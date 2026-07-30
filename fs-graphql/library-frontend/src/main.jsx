import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import { ApolloClient, gql, HttpLink, InMemoryCache } from "@apollo/client";
//using this made the client accessible for all components of the application by wrapping the App with it
import { ApolloProvider } from "@apollo/client/react";

//client constructor
//the code creates a new client object, which is then used to send a query to the server
const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:4000",
  }),
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
      author
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
