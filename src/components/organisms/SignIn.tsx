import React, { useContext, useState } from "react";
import { TextField, Button, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Image from "next/image";
import { AuthContext } from "../../contexts/AuthContext";

///////////
//Component
///////////
export const SignIn = () => {
  const classes = useStyles();
  const { signinWithEmailAndPassword } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");
  const useInput = (initialValue) => {
    const [value, set] = useState(initialValue);
    return { value, onChange: (e) => set(e.target.value) };
  };

  const email = useInput("");
  const password = useInput("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await signinWithEmailAndPassword(email, password);
    setErrorMessage(result);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* <Separator /> */}
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
        variant="contained"
        color="primary"
      >
        サインイン
      </Button>
    </form>
  );
};

///////
//Style
///////
const useStyles = makeStyles({
  button: {
    width: "80%",
  },
  textField: {
    width: "80%",
    margin: "10px 0",
  },
});
