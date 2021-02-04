import React, { useState, useContext } from "react";
import Layout from "../../src/components/templates/Layout/Layout";
import { Button, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Image from "next/image";
import { useRouter } from "next/router";

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
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  explain: {
    margin: 50,
  },
  section: {
    height: "91vh",
  },
}));

const About = () => {
  const classes = useStyles();
  const router = useRouter();
  return (
    <Layout>
      <Grid container xs={12} className={classes.container}>
        <div className={classes.section}>
          <Typography variant="h2" className={classes.explain}>
            What is Create Ideas?
          </Typography>
          {/* <Image
            src="/aboutPage/whatis.svg"
            alt="whatis"
            height="300"
            width="920"
            quality={50}
          /> */}
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
          {/* <Image
            src="/aboutPage/step1.gif"
            alt="step1"
            height="600"
            width="1020"
            className={classes.img}
            quality={50}
          /> */}
        </div>
        <div className={classes.section}>
          {/* <Image
            src="/aboutPage/step2.gif"
            alt="step2"
            height="600"
            width="1020"
            className={classes.img}
            quality={50}
          /> */}
          <div>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              size="large"
              onClick={() => router.push("/auth")}
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
