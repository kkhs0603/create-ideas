// @ts-nocheck
import React, { useEffect } from "react";
import Layout from "../../components/templates/Layout/Layout";
import { TextField, Button, Avatar, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Canvas from "../../components/organisms/Canvas";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import firebase from "../../firebase/firebase";

import { MaterialsProvider } from "../../contexts/MaterialsContext";
const Canvases = () => {
  const classes = useStyles();
  const router = useRouter();
  const canvasId = router.query.id;
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    noClick: true,
    accept: "image/jpeg, image/png",
  });

  useEffect(() => {
    acceptedFiles.map((file) => {
      //storageにアップロード
      const storage = firebase.storage();
      const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const idLength = 20;
      let id = Array.from(Array(idLength))
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join("");
      storage.ref(`/images/imageBox/${id}`).put(file);

      //CloudFirestoreのCanvasにImageBoxを追加
      //ドロップしたx、yは取れるか
    });
  }, [acceptedFiles]);

  return (
    <Layout>
      <MaterialsProvider>
        <div {...getRootProps({ className: "dropzone" })}>
          <Canvas id={canvasId} />
          <input {...getInputProps()} style={{ outline: "none" }} />
        </div>
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
