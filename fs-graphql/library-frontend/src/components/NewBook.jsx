import { useState } from "react";

import { useMutation } from "@apollo/client/react";
import { ALL_BOOKS, ALL_AUTHORS } from "./queries";
import { ADD_BOOK } from "./mutations";

const NewBook = (props) => {
  const updateCache = (cache, query, addedBook) => {
    cache.updateQuery(query, ({ allBooks }) => {
      return {
        allBooks: allBooks.concat(addedBook),
      };
    });
  };
  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    update: (cache, response) => {
      updateCache(cache, { query: ALL_BOOKS }, response.data.addBook);
    },
  });

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();
    console.log({
      title,
      author,
      published,
      genres,
    });

    await addBook({
      variables: {
        title,
        author,
        published: Number(published),
        genres,
      },
    });

    console.log("add book...");

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    //Prevent empty genres
    if (genre.trim() === "") return;

    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <label>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </label>
        <label>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>

        <label>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </label>

        <label>
          genre
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </label>

        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
