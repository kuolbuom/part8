import { useQuery } from "@apollo/client/react";

//expected books
import { ALL_BOOKS } from "./queries";

const Books = (props) => {
  //wrapp all books in useQuery
  const result = useQuery(ALL_BOOKS);
  // console.log("all books", result);
  //displaying before data
  if (result.loading) {
    return <div>loading...</div>;
  }

  if (!props.show) {
    return null;
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {result.data.allBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
