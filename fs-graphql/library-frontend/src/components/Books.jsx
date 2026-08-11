import { useQuery } from "@apollo/client/react";

//expected books
import { ALL_BOOKS } from "./queries";
import { useState } from "react";

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  //wrapp all books in useQuery
  // const result = useQuery(ALL_BOOKS);
  const allBooksResult = useQuery(ALL_BOOKS, {
    skip: !props.show,
  });

  if (!props.show) {
    return null;
  }

  //the books view is updated at least when a genre selection button is pressed
  // const filteredBooksResult = useQuery(ALL_BOOKS, {
  //   variables: { genre: selectedGenre },
  //   fetchPolicy: "network-only",
  // });

  // console.log("all books", result);
  //displaying before data
  // if (allBooksResult.loading || filteredBooksResult.loading) {
  //   return <div>loading...</div>;
  // }
  if (allBooksResult.loading) {
    return <div>loading...</div>;
  }

  //Filter the books
  // const booksToShow = selectedGenre
  //   ? result.data.allBooks.filter((book) => book.genres.includes(selectedGenre))
  //   : result.data.allBooks;
  // const booksToShow = filteredBooksResult.data.allBooks;

  const booksToShow = selectedGenre
    ? allBooksResult.data.allBooks.filter((book) =>
        book.genres.includes(selectedGenre),
      )
    : allBooksResult.data.allBooks;

  //Get all unique genres From result.data.allBooks
  // const genres = [
  //   ...new Set(
  //     result.data.allBooks
  //       .flatMap((book) => book.genres)
  //       .filter((genre) => genre !== ""),
  //   ), //this filter, Hide existing empty genres
  // ];

  //Build genres from all books
  const genres = [
    ...new Set(
      allBooksResult.data.allBooks
        .flatMap((book) => book.genres)
        .filter((genre) => genre !== ""),
    ), //this filter, Hide existing empty genres
  ];

  console.log("Genres:", genres);
  console.log("Books:", allBooksResult.data.allBooks);

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
