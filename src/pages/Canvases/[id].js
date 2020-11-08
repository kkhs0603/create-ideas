import React, { useContext, useEffect, useState } from "react";
import { CanvasContext } from "../../contexts/CanvasContext";
import Layout from "../../components/templates/Layout/Layout";
import { TextField, Button, Avatar, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "../../firebase/firebase";
import SendStickyNote from "../../components/organisms/SendStickyNote";
import StickyNotesArea from "../../components/organisms/StickyNotesArea";

export async function getCanvasIds() {
  const db = firebase.firestore();
  const snapshot = await db.collection("canvases").get();
  const ids = snapshot.docs.map((doc) => {
    return doc.id;
  });
  return ids;
}

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
  const { enterCanvas, joinedUsers, canvasData } = useContext(CanvasContext);
  console.log(canvasData);
  const id = props.id;

  const users = joinedUsers.map((user) => (
    <Avatar user={user} key={user.id} alt="user" src={user.imageUrl} />
  ));
  useEffect(() => {
    enterCanvas(id);
  }, []);

  console.log(canvasData);
  return (
    <Layout>
      <Grid container spacing={3} className={classes.top}>
        <Grid item xs={6}>
          <div>canvas名：{canvasData?.name}</div>
        </Grid>
        <Grid item xs={6}>
          <div>参加者</div>
          <div className={classes.avatars}>{users}</div>
        </Grid>
      </Grid>
      <div className={classes.middle}>
        <StickyNotesArea words={canvasData?.words} />
      </div>
      <div className={classes.bottom}>
        <SendStickyNote />
      </div>
    </Layout>
  );
};

export default Canvas;

///////
//Style
///////
const useStyles = makeStyles({
  avatars: {
    display: "flex",
  },
  top: {
    position: "fixed",
    height: "100px",
  },
  middle: {
    paddingTop: "100px",
  },
  bottom: {
    position: "fixed",
    bottom: "5%",
    left: "40%",
  },
});
