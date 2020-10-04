import React from "react";
import { useSignUp } from "../../hooks/useSignUp.js";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";

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
