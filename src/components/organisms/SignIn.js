import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Separator } from "../atoms/Separator/Separator";
import { TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

///////
//Logic
///////
const useSignIn = () => {
  const { signinWithGoogle, signinWithEmailAndPassword } = useContext(
    AuthContext
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleEmailOnChanged = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordOnChanged = (event) => {
    setPassword(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await signinWithEmailAndPassword(email, password);
    setErrorMessage(result);
  };
  return [
    errorMessage,
    signinWithGoogle,
    handleSubmit,
    handleEmailOnChanged,
    handlePasswordOnChanged,
  ];
};

///////////
//Component
///////////
export const SignIn = () => {
  const classes = useStyles();
  const [
    errorMessage,
    signinWithGoogle,
    handleSubmit,
    handleEmailOnChanged,
    handlePasswordOnChanged,
  ] = useSignIn();

  return (
    <div>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={signinWithGoogle}
      >
        Googleアカウントでサインイン
      </Button>
      <Separator />
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <TextField
          className={classes.textField}
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          helperText={""}
          fullWidth
          variant="outlined"
          onChange={handleEmailOnChanged}
        />
        <TextField
          className={classes.textField}
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          helperText={""}
          fullWidth
          variant="outlined"
          onChange={handlePasswordOnChanged}
        />
        {errorMessage ? errorMessage : ""}
        <Button type="submit" fullWidth variant="contained" color="primary">
          サインイン
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
    margin: "10px 0",
  },
});
