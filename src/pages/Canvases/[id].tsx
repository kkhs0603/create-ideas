import React, { useContext, useEffect, useState } from "react";
import { CanvasContext } from "../../contexts/CanvasContext";
import Layout from "../../components/templates/Layout/Layout";
import { TextField, Button, Avatar, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import StickyNotesArea from "../../components/organisms/StickyNotesArea";
import { useRouter } from "next/router";

const Canvas = () => {
  const classes = useStyles();
  const { joinedUsers, canvasData } = useContext(CanvasContext);
  const router = useRouter();
  const id = router.query.id;
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
