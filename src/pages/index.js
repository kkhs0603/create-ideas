import React, { useState } from "react";
import Layout from "../components/templates/Layout/Layout";
import Title from "../components/atoms/Title/Title";
import TopSlider from "../components/molecules/TopSlider/TopSlider";
import { SignIn } from "../components/organisms/SignIn";
import { SignUp } from "../components/organisms/SignUp";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

const useStyles = makeStyles({
  button: {
    color: "BLUE",
  },
});

const SignInPage = () => {
  const classes = useStyles();
  const [isSignIn, setIsSignIn] = useState(true);
  const caption = isSignIn ? "登録しますか？" : "サインインしますか？";
  return (
    <Layout>
      <Title />
      <TopSlider />
      {isSignIn ? <SignIn /> : <SignUp />}
      <Button
        className={classes.button}
        onClick={() => setIsSignIn(!isSignIn)}
        disableRipple
      >
        {caption}
      </Button>
    </Layout>
  );
};

export default SignInPage;
