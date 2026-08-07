import { useQuery } from "@apollo/client/react";
import { ME, ALL_BOOKS } from "./queries";

const Recommendations = ({ show }) => {
  const meResult = useQuery(ME);

  const booksResult = useQuery(ALL_BOOKS, {
    variables: {
      genre: meResult.data?.me?.favoriteGenre,
    },
    skip: !meResult.data,
  });

  if (!show) {
    return null;
  }

  if (meResult.loading || booksResult.loading) {
    return <div>loading...</div>;
  }

  const favoriteGenre = meResult.data.me.favoriteGenre;

  return (
    <div>
      <h2>recommendations</h2>

      <p>
        books in your favorite genre <strong>{favoriteGenre}</strong>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>

          {booksResult.data.allBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
