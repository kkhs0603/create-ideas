import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";

///////
//Logic
///////
const useSignUp = () => {
  const { signupWithEmailAndPassword } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleEmailOnChanged = (event) => {
    setUserName(event.target.value);
  };
  const handleUserNameOnChanged = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordOnChanged = (event) => {
    setPassword(event.target.value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    const result = await signupWithEmailAndPassword(email, password, userName);
    setErrorMessage(result);
  };
  return [
    errorMessage,
    onSubmit,
    handleUserNameOnChanged,
    handleEmailOnChanged,
    handlePasswordOnChanged,
  ];
};

///////////
//Component
///////////
export const SignUp = () => {
  const classes = useStyles();
  const [
    errorMessage,
    onSubmit,
    handleUserNameOnChanged,
    handleEmailOnChanged,
    handlePasswordOnChanged,
  ] = useSignUp();
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
          onChange={handleUserNameOnChanged}
        />
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
    margin: "10px 0",
  },
});
