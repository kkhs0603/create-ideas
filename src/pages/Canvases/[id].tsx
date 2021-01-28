// @ts-nocheck
import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/templates/Layout/Layout";
import { TextField, Button, Avatar, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Canvas from "../../components/organisms/Canvas";
import { useRouter } from "next/router";

import { MaterialsProvider } from "../../contexts/MaterialsContext";
const Canvases = () => {
  const classes = useStyles();
  const router = useRouter();
  const canvasId = router.query.id;

  return (
    <Layout>
      <MaterialsProvider>
        <Canvas id={canvasId} />
      </MaterialsProvider>
    </Layout>
  );
};

export default Canvases;

///////
//Style
///////
const useStyles = makeStyles((theme) => ({
  avatars: {
    display: "flex",
  },
}));
