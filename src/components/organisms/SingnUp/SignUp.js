import React, { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/Auth";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";

const useStyles = makeStyles({
  textField: {
    margin: "10px 0",
  },
});

export const SignUp = () => {
  const classes = useStyles();
  const { signupWithEmailAndPassword } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFirst, setIsFirst] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    setIsFirst(false);
    const result = await signupWithEmailAndPassword(email, password, userName);
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
          error={!isFirst && userName.length === 0}
          helperText={""}
          fullWidth
          variant="outlined"
          onChange={(e) => setUserName(e.target.value)}
        />
        <TextField
          className={classes.textField}
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          error={!isFirst && email.length === 0}
          helperText={""}
          fullWidth
          variant="outlined"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          className={classes.textField}
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          error={!isFirst && password.length === 0}
          helperText={""}
          fullWidth
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage ? errorMessage : ""}
        <Button type="submit" fullWidth variant="contained" color="primary">
          登録
        </Button>
      </form>
    </div>
  );
};
