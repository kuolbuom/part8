import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { ADD_BOOK } from "./mutations";
//expected authors
import { ALL_AUTHORS } from "./queries";

const Authors = (props) => {
  //wrapp all authors in useQuery
  const result = useQuery(ALL_AUTHORS);

  //displaying before data
  if (result.loading) {
    return <div>loading...</div>;
  }

  if (!props.show) {
    return null;
  }
  const authors = [];

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>

          {result.data.allAuthors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Authors;
