import React, { useContext } from "react";
import { Button, TextField } from "@material-ui/core";
import { CanvasContext } from "../../contexts/CanvasContext";
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

const CreateCanvas = () => {
  const { createCanvas, handleCanvasName } = useContext(CanvasContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    createCanvas();
  };
  return (
    <div>
      <span>Canvasを作る</span>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <TextField
          id="outlined-basic"
          label="Canvas名"
          variant="outlined"
          required
          onChange={handleCanvasName}
        />
        <ColorButton type="submit">Canvas作成</ColorButton>
      </form>
    </div>
  );
};

export default CreateCanvas;
