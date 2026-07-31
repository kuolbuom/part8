import { useState } from "react";
import { EDIT_BORN } from "./queries";

import { useMutation } from "@apollo/client/react";

const BirthYear = ({ authors }) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState(authors[0]?.name || "");

  const [changeBorn] = useMutation(EDIT_BORN, {
    refetchQueries: [{ query: EDIT_BORN }],
  });

  const submit = (event) => {
    event.preventDefault();
    // Ensure the mutation name and arguments match the backend schema.
    changeBorn({ variables: { name, setBornTo: Number(born) } });

    setName("");
    setBorn("");
  };

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name
          <select value={name} onChange={({ target }) => setName(target.value)}>
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
          born
          <input
            type="text"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default BirthYear;
