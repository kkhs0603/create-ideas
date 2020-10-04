import React from "react";
import { useSignIn } from "../../hooks/useSignIn";
import { Separator } from "../atoms/Separator/Separator";
import { TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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
