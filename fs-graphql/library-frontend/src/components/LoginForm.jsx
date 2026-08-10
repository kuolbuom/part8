import { useMutation } from "@apollo/client/react";
import { useState } from "react";

import { LOG_IN } from "./queries";

const LoginForm = ({ setToken, setPage, show }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [userLogin] = useMutation(LOG_IN, {
    onCompleted: (data) => {
      setToken(data.login.value);
      //save it token
      localStorage.setItem("library-user-token", data.login.value);
      setPage("authors");
    },
  });

  if (!show) {
    return null;
  }

  const handleLogin = async (event) => {
    event.preventDefault();

    const result = await userLogin({
      variables: {
        username,
        password,
      },
    });

    console.log("Login data", result.data.login.value);
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
