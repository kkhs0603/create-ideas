import React, { useState, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { Separator } from "../../atoms/Separator/Separator";
import { InputLabel, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  textField: {
    margin: "10px 0",
  },
});

export const SignIn = () => {
  const classes = useStyles();
  const { signinWithGoogle, signinWithEmailAndPassword } = useContext(
    AuthContext
  );
  //TODO:カスタムHookを使うように

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isFirst, setIsFirst] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsFirst(false);
    const result = await signinWithEmailAndPassword(email, password);
    setErrorMessage(result);
  };
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
          //FIXME:isFirstいらんかも
          error={!isFirst && email.length === 0}
          helperText={""}
          fullWidth
          variant="outlined"
          //FIXME:handleOnChangeなどで上に切り出す
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
          //FIXME:handleOnChangeなどで上に切り出す
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage ? errorMessage : ""}
        <Button type="submit" fullWidth variant="contained" color="primary">
          サインイン
        </Button>
      </form>
    </div>
  );
};
