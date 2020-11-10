import React, { useState, useContext } from "react";
import { CanvasContext } from "../../contexts/CanvasContext";
import { Button, TextField, Menu, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Draggable from "react-draggable";

const initialState = {
  mouseX: null,
  mouseY: null,
};

const StickyNote = (props) => {
  const classes = useStyles();
  const { deleteWord, deletable, movedStickyNote } = useContext(CanvasContext);
  const [state, setState] = useState(initialState);
  const enableDelete = deletable(props.data.createdBy);

  const [position, setPosition] = useState({ x: 0, y: 0 });

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

  const handleStart = () => {};

  const handleDrag = (e, ui) => {
    const nowPosition = position;
    setPosition({ x: nowPosition.x + ui.deltaX, y: nowPosition.y + ui.deltaY });
  };

  const handleStop = (e, ui) => {
    console.log("x", position.x);
    console.log("y", position.y);
    if (position.x < 0) {
      position.x = 0;
    }
    if (position.y < 0) {
      position.y = 0;
    }
    movedStickyNote(props.data.id, position.x, position.y);
  };

  const positionX =
    props.data.position?.x === undefined ? 0 : props.data.position.x;
  const positionY =
    props.data.position?.y === undefined ? 0 : props.data.position.y;

  return (
    <Draggable
      defaultPosition={{ x: 0, y: 0 }}
      position={{ x: positionX, y: positionY }}
      onStart={handleStart}
      onDrag={handleDrag}
      onStop={handleStop}
      bounds="parent"
    >
      <div
        className={classes.container}
        onClick={(e) => e.preventDefault}
        onContextMenu={handleClick}
      >
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
    </Draggable>
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
