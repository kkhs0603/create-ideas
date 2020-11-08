import React, { useState, useContext } from "react";
import { CanvasContext } from "../../contexts/CanvasContext";
import { Button, TextField, Menu, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const initialState = {
  mouseX: null,
  mouseY: null,
};

const StickyNote = (props) => {
  const classes = useStyles();
  const { deleteWord, deletable } = useContext(CanvasContext);
  const [state, setState] = useState(initialState);
  const enableDelete = deletable(props.data.createdBy);

  const handleClick = (e) => {
    e.preventDefault();
    setState({
      mouseX: e.clientX - 2,
      mouseY: e.clientY - 4,
    });
  };

  const handleClose = () => {
    setState(initialState);
  };

  return (
    <div className={classes.container} onContextMenu={handleClick}>
      <p>{props.data.word}</p>
      <Menu
        keepMounted
        open={state.mouseY !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          state.mouseY !== null && state.mouseX !== null
            ? { top: state.mouseY, left: state.mouseX }
            : undefined
        }
      >
        <MenuItem
          disabled={!enableDelete}
          onClick={() => {
            deleteWord(props.data.id);
            handleClose();
          }}
        >
          削除
        </MenuItem>
      </Menu>
    </div>
  );
};
///////
//Style
///////
const useStyles = makeStyles({
  container: {
    display: "inline-block",
    backgroundColor: "#FEF3B5",
    padding: "10px",
    margin: "5px",
    whiteSpace: "pre-wrap",
  },
});

export default StickyNote;
