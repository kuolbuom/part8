import { useState } from "react";
import { EDIT_BORN, ALL_AUTHORS } from "./queries";

import { useMutation } from "@apollo/client/react";

const BirthYear = ({ authors }) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState(authors[0]?.name || "");

  const [changeBorn] = useMutation(EDIT_BORN, {
    update(cache, { data }) {
      const updatedAuthor = data?.editAuthor;

      if (!updatedAuthor) return;

      cache.modify({
        id: cache.identify(updatedAuthor),
        fields: {
          born: () => updatedAuthor.born,
        },
      });
    },
  });

  // const [changeBorn] = useMutation(EDIT_BORN, {
  //   refetchQueries: [{ query: ALL_AUTHORS }],
  //   onQueryUpdated: (observableQuery) => {
  //     console.log("REFETCHING ALL_AUTHORS");
  //     return observableQuery.refetch();
  //   },
  // });

  const submit = async (event) => {
    event.preventDefault();
    // Ensure the mutation name and arguments match the backend schema.
    const result = await changeBorn({
      variables: { name, setBornTo: Number(born) },
    });
    console.log("EDIT RESULT:", result);
    setName("");
    setBorn("");
  };

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name
          <select
            name="name"
            value={name}
            onChange={({ target }) => setName(target.value)}
          >
            {authors.map((author) => (
              <option key={author.name} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
          {/* <input
            type="text"
            value={name}
            onChange={({ target }) => setName(target.value)}
          /> */}
        </div>

        <div>
          <label>
            born
            <input
              type="text"
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
          </label>
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default BirthYear;
