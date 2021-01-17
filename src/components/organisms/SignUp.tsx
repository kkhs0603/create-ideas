import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";
import { AuthContext } from "../../contexts/AuthContext";

///////////
//Component
///////////
export const SignUp = () => {
  const classes = useStyles();
  const { signupWithEmailAndPassword } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");
  const useInput = (initialValue) => {
    const [value, set] = useState(initialValue);
    return { value, onChange: (e) => set(e.target.value) };
  };

  const email = useInput("");
  const password = useInput("");
  const userName = useInput("");

  const onSubmit = async (event) => {
    event.preventDefault();
    const result = await signupWithEmailAndPassword(
      email.value,
      password.value,
      userName.value
    );
    setErrorMessage(result);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <TextField
          className={classes.textField}
          id="username"
          label="UserName"
          type="text"
          autoComplete="off"
          required
          helperText={""}
          fullWidth
          variant="outlined"
          {...userName}
        />
        <TextField
          className={classes.textField}
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          helperText={""}
          variant="outlined"
          {...email}
        />
        <TextField
          className={classes.textField}
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          helperText={""}
          variant="outlined"
          {...password}
        />
        <div>{errorMessage ? errorMessage : ""}</div>
        <Button
          className={classes.button}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          登録
        </Button>
      </form>
    </div>
  );
};

///////
//Style
///////
const useStyles = makeStyles({
  textField: {
    width: "80%",
    margin: "10px 0",
  },
  button: {
    width: "80%",
  },
});
