// @ts-nocheck
import React, { useContext, useState, useEffect } from "react";
import { CanvasContext } from "../contexts/CanvasContext";
import { AuthContext } from "../contexts/AuthContext";
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
  const [isOpenedDeleteCanvasModal, setIsOpenedDeleteCanvasModal] = useState(
    false
  );

  const { canvases, getCanvases, getTemplates, deleteCanvas } = useContext(
    CanvasContext
  );
  const { user } = useContext(AuthContext);
  const handleOpen = () => {
    setIsOpenedModal(true);
  };
  const handleClose = () => {
    setIsOpenedModal(false);
    setIsOpenedDeleteCanvasModal(false);
  };

  const [selectedCanvasName, setSelectedCanvasName] = useState("");
  const [selectedCanvasId, setSelectedCanvasId] = useState("");
  const openDeleteModal = (canvasName, canvasId) => {
    setSelectedCanvasName(canvasName);
    setSelectedCanvasId(canvasId);
    setIsOpenedDeleteCanvasModal(true);
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
        >
          <div>
            <CreateCanvas />
          </div>
        </Modal>
        <Modal
          className={classes.modal}
          open={isOpenedDeleteCanvasModal}
          onClose={handleClose}
        >
          <div
            style={{ backgroundColor: "white", width: "30%", height: "40%" }}
          >
            Canvas名：{selectedCanvasName}
            <div>こちらのCanvasを削除しますか？</div>
            <div>
              <Button variant="contained" onClick={handleClose}>
                キャンセル
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  deleteCanvas(selectedCanvasId);
                  handleClose();
                }}
              >
                削除
              </Button>
            </div>
          </div>
        </Modal>
        <Grid container direction="row" justify="flex-end" alignItems="center">
          <IconButton onClick={handleOpen}>
            <AddCircleOutlineIcon fontSize="large" />
          </IconButton>
        </Grid>
        <div style={{ height: "70vh" }}>
          <div>Canvas一覧</div>
          <SelectCanvas
            canvases={canvases}
            user={user}
            openDeleteModal={openDeleteModal}
          />
        </div>
      </Container>
    </Layout>
  );
};

export default CanvasListPage;
