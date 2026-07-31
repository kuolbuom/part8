import { useState } from "react";
import { EDIT_BORN } from "./queries";

import { useMutation } from "@apollo/client/react";

const BirthYear = () => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const [changeBorn] = useMutation(EDIT_BORN, {
    refetchQueries: [{ query: EDIT_BORN }],
  });

  const submit = (event) => {
    event.preventDefault();
    //should align with the backend
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
          <input
            type="text"
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
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
