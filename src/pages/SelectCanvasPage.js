import React, { useContext, useState, useEffect } from "react";
import { CanvasContext } from "../contexts/CanvasContext";
import Layout from "../components/templates/Layout/Layout";
import { Button, List, ListItem, ListItemText } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { orange } from "@material-ui/core/colors";
const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(orange[500]),
    backgroundColor: orange[500],
    "&:hover": {
      backgroundColor: orange[700],
    },
  },
}))(Button);

const SelectCanvasPage = () => {
  const { newCanvas, canvases } = useContext(CanvasContext);

  return (
    <Layout>
      <div>Canvas</div>
      <ColorButton onClick={newCanvas}>Canvasを作る</ColorButton>
      <div>Canvas一覧</div>
      <div>
        {canvases.map((canvas) => (
          <ListItem key={canvas.created_at} button>
            <ListItemText key={canvas.created_at} primary={canvas.created_by} />
          </ListItem>
        ))}
      </div>
    </Layout>
  );
};

export default SelectCanvasPage;
