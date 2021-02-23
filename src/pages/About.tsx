import React, { useState, useContext } from "react";
import Layout from "../../src/components/templates/Layout/Layout";
import { Button, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import whatIs from "../../public/aboutPage/whatis.svg";
import step1 from "../../public/aboutPage/step1.gif";

const useStyles = makeStyles((theme) => ({
  button: {
    textTransform: "none",
    margin: 10,
  },
  img: {
    width: "70%",
    margin: "10px",
    height: "auto",
    color: "#fff",
    outline: "none",
  },
  howToImg: {
    width: "100%",
    margin: "10px",
    height: "auto",
    color: "#fff",
    outline: "none",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  explain: {
    margin: 40,
  },
  section: {
    marginBottom: "50px",
  },
}));

const About = () => {
  const classes = useStyles();
  const router = useRouter();
  return (
    <Layout>
      <Grid container className={classes.container}>
        <div className={classes.section}>
          <Typography variant="h2" className={classes.explain}>
            What is Create Ideas?
          </Typography>
          <img src={whatIs} alt="step1" className={classes.img} />
          <Typography className={classes.explain}>
            個人開発、チーム開発などで新しくプロダクトを作る際に、最も必要で難航するアイデア出し。
          </Typography>
          <Typography>
            そのアイデア出しをより簡単にするために作成しました。
          </Typography>
          <Typography className={classes.explain}>
            付箋や線などを自由に配置し、アイデアを創造しよう。
          </Typography>
        </div>
        <div className={classes.section}>
          <Typography variant="h2">How to use?</Typography>
          <img
            src="/aboutPage/step1.gif"
            alt="step1"
            className={classes.howToImg}
          />
        </div>
        <div className={classes.section}>
          <img
            src="/aboutPage/step2.gif"
            alt="step2"
            className={classes.howToImg}
          />
          <div>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              size="large"
              onClick={() => router.push("/Auth")}
            >
              Create Ideasを使ってみる
            </Button>
          </div>
        </div>
      </Grid>
    </Layout>
  );
};

export default About;
