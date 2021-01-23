// @ts-nocheck
import React, { useContext, useEffect, useState } from "react";
import { CanvasContext } from "../../contexts/CanvasContext";
import Layout from "../../components/templates/Layout/Layout";
import { TextField, Button, Avatar, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import StickyNotesArea from "../../components/organisms/StickyNotesArea";
import { useRouter } from "next/router";

const Canvas = () => {
  const classes = useStyles();
  const { enterCanvas } = useContext(CanvasContext);
  const router = useRouter();
  const canvasId = router.query.id;
  useEffect(() => {
    enterCanvas(canvasId);
  }, []);
  return (
    <Layout>
      <StickyNotesArea id={canvasId} />
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
}));
