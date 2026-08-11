import { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommendations from "./components/Recommendations";

import { useApolloClient, useSubscription } from "@apollo/client/react";
import { BOOK_ADDED, ALL_BOOKS } from "./components/queries";

const App = () => {
  const client = useApolloClient();

  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  //subscription code
  useSubscription(BOOK_ADDED, {
    onData: async ({ data }) => {
      console.log("SUBSCRIPTION DATA:", data);
      const book = data.data?.bookAdded;

      if (!book) return;

      console.log("New book added:", book);
      window.alert(`New book added: ${book.title}`);

      await client.refetchQueries({
        include: [ALL_BOOKS],
      });
    },

    onComplete: () => {
      console.log("Subscription completed");
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("library-user-token");

    if (token) {
      setToken(token);
    }
  }, []);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("library-user-token");
    setPage("authors");
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>

        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      {/* {token && } */}

      <Authors show={page === "authors"} token={token} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} token={token} />

      <LoginForm
        show={page === "login"}
        setToken={setToken}
        setPage={setPage}
      />

      {<Recommendations show={page === "recommend"} />}
    </div>
  );
};

export default App;
