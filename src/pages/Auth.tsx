import React, { useState, useContext } from "react";
import Layout from "../components/templates/Layout/Layout";
import { Button, Grid, Typography } from "@material-ui/core";
import { SignIn } from "../components/organisms/SignIn";
import { SignUp } from "../components/organisms/SignUp";
import { makeStyles } from "@material-ui/core/styles";
import Image from "next/image";
import { AuthContext } from "../contexts/AuthContext";

const useStyles = makeStyles((theme) => ({
  button: {
    textTransform: "none",
    margin: 10,
  },
  img: {
    width: "80%",
    margin: "10px",
    height: "auto",
    color: "#fff",
    outline: "none",
  },
  container: {
    height: "91vh",
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  explain: {
    margin: 50,
  },
}));

const Auth = () => {
  const classes = useStyles();
  const [isSignIn, setIsSignIn] = useState<Boolean>(true);
  const { signinWithGoogle } = useContext(AuthContext);
  const caption: string = isSignIn
    ? "メールアドレス登録はこちら"
    : "サインインはこちら";
  return (
    <Layout>
      <Grid container className={classes.container}>
        <Grid item xs={6}>
          <Typography variant="h6" className={classes.explain}>
            Googleアカウントでログイン・登録する
          </Typography>
          <Button onClick={signinWithGoogle}>
            <img
              src="/topPage/btn_google_signin_dark_normal_web@2x.png"
              alt="signInWithGoogle"
            />
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" className={classes.explain}>
            メールアドレスでログイン・登録する
          </Typography>
          {isSignIn ? <SignIn /> : <SignUp />}
          <Button
            className={classes.button}
            onClick={() => setIsSignIn(!isSignIn)}
            disableRipple
          >
            {caption}
          </Button>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Auth;
