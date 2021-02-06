import React, { useState, useContext } from "react";
import Layout from "../components/templates/Layout/Layout";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import { Button, Grid, Typography } from "@material-ui/core";
import { AuthContext } from "../contexts/AuthContext";
import Logo from "../../public/topPage/topIllust.svg";

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: "center",
  },
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
  col: {
    textAlign: "center",
  },
}));

const SignInPage: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();
  const { signInTestUser } = useContext(AuthContext);
  return (
    <Layout>
      <Grid
        container
        alignItems="center"
        direction="row"
        style={{
          height: "92vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item xs={6} className={classes.col}>
          <Typography variant="h1">Create Ideas</Typography>
          <Typography variant="h5">アイデア出しをより手軽に</Typography>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            size="large"
            onClick={() => router.push("/auth")}
          >
            SignIn
          </Button>
          <Button
            variant="contained"
            className={classes.button}
            size="large"
            onClick={() => router.push("/about")}
          >
            About
          </Button>
          <div>
            <Button
              variant="outlined"
              className={classes.button}
              onClick={() => signInTestUser()}
            >
              テストユーザーでサインイン
            </Button>
          </div>
        </Grid>
        <Grid item xs={6}>
          <img className={classes.img} src={Logo} />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default SignInPage;
