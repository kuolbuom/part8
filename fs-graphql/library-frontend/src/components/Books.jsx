import { useQuery } from "@apollo/client/react";

//expected books
import { ALL_BOOKS } from "./queries";
import { useState } from "react";

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  //wrapp all books in useQuery
  const result = useQuery(ALL_BOOKS);

  // console.log("all books", result);
  //displaying before data
  if (result.loading) {
    return <div>loading...</div>;
  }

  //Filter the books
  const booksToShow = selectedGenre
    ? result.data.allBooks.filter((book) => book.genres.includes(selectedGenre))
    : result.data.allBooks;

  //Get all unique genres From result.data.allBooks
  const genres = [
    ...new Set(
      result.data.allBooks
        .flatMap((book) => book.genres)
        .filter((genre) => genre !== ""),
    ), //this filter, Hide existing empty genres
  ];

  if (!props.show) {
    return null;
  }

  console.log("Genres:", genres);
  console.log("Books:", result.data.allBooks);

  return (
    <div>
      <h2>books</h2>
      <p>
        in genre <strong>{selectedGenre || "all genres"}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setSelectedGenre(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setSelectedGenre(null)}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
