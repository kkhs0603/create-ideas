import React, { useContext, useEffect, useState } from "react";
import { CanvasContext } from "../../contexts/CanvasContext";
import Layout from "../../components/templates/Layout/Layout";
import { TextField, Button, Avatar, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "../../firebase/firebase";
import StickyNotesArea from "../../components/organisms/StickyNotesArea";

export async function getCanvasIds() {
  const db = firebase.firestore();
  const snapshot = await db.collection("canvases").get();
  const ids = snapshot.docs.map((doc) => doc.id);
  return ids;
}
//動的にページ遷移
export async function getStaticPaths() {
  const ids = await getCanvasIds();
  const paths = ids.map((id) => {
    return "/Canvases/" + id;
  });
  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  return { props: params };
}

const Canvas = (props) => {
  const classes = useStyles();
  const { joinedUsers, canvasData } = useContext(CanvasContext);
  const id = props.id;

  const users = joinedUsers.map((user) => (
    <Avatar
      className={classes.small}
      user={user}
      key={user.id}
      alt="user"
      src={user.imageUrl}
    />
  ));
  useEffect(() => {}, []);
  return (
    <Layout>
      <Grid container className={classes.top}>
        <Grid item xs={6}>
          <div>canvas名：{canvasData?.name}</div>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.avatars}>参加者：{users}</div>
        </Grid>
      </Grid>
      <div className={classes.middle}>
        <StickyNotesArea id={id} />
      </div>
      {/* <div className={classes.bottom}>
        <SendStickyNote id={id} />
      </div> */}
    </Layout>
  );
};

export default Canvas;

///////
//Style
///////
const useStyles = makeStyles((theme) => ({
  avatars: {
    display: "flex",
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  top: {
    position: "fixed",
    height: "4vh",
  },
  middle: {
    paddingTop: "4vh",
  },
  bottom: {
    position: "fixed",
    bottom: "1%",
    left: "40%",
  },
}));
