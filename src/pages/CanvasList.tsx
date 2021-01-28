// @ts-nocheck
import React, { useContext, useState, useEffect } from "react";
import { CanvasContext } from "../contexts/CanvasContext";
import Layout from "../components/templates/Layout/Layout";
import CreateCanvas from "../components/organisms/CreateCanvas";
import SelectCanvas from "../components/organisms/SelectCanvas";
import { Grid, Modal, Container, Button, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const CanvasListPage = () => {
  const classes = useStyles();
  const [isOpenedModal, setIsOpenedModal] = useState(false);

  const { canvases, getCanvases, getTemplates } = useContext(CanvasContext);
  const handleOpen = () => {
    setIsOpenedModal(true);
  };
  const handleClose = () => {
    setIsOpenedModal(false);
  };
  useEffect(() => {
    getCanvases();
    getTemplates();
  }, []);
  return (
    <Layout>
      <Container>
        <Modal
          className={classes.modal}
          open={isOpenedModal}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <CreateCanvas />
        </Modal>
        <Grid container direction="row" justify="flex-end" alignItems="center">
          <IconButton onClick={handleOpen}>
            <AddCircleOutlineIcon fontSize="large" />
          </IconButton>
        </Grid>
        <div style={{ height: "70vh" }}>
          <div>Canvas一覧</div>
          <SelectCanvas canvases={canvases} />
        </div>
      </Container>
    </Layout>
  );
};

export default CanvasListPage;
