import React, { useContext, useEffect, useState } from "react";
import { CanvasContext } from "../../contexts/CanvasContext";
import Layout from "../../components/templates/Layout/Layout";
import { TextField, Button, Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "../../firebase/firebase";

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
  const { enterCanvas, joinedUsers } = useContext(CanvasContext);
  const id = props.id;
  useEffect(() => {
    enterCanvas(id);
  }, []);
  const users = joinedUsers.map((user) => (
    <Avatar user={user} key={user.id} alt="user" src={user.image_url} />
  ));

  return (
    <Layout>
      <div className={classes.avatars}>{users}</div>
      <TextField></TextField>
      <Button type="submit" fullWidth variant="contained" color="primary">
        送信
      </Button>
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
});
