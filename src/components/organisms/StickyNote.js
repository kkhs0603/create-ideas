import React, { useState, useContext, useRef ,useEffect} from "react";
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
  const [position, setPosition] = useState({ x:props.data.positionX,y:props.data.positionY  });

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

  const handleStart = () => {
  };

  const handleDrag = (e, ui) => {
    const nowPosition = position;
    setPosition({ x: nowPosition.x + ui.deltaX, y: nowPosition.y + ui.deltaY });
  };

  const handleStop = (e, ui) => {
    movedStickyNote(props.data.id, ui.x, ui.y);
  };
  const enableDelete = deletable(props.data.createdBy);
  
  return (
    <Draggable
      position={{x:position.x,y:position.y}}
      onStart={handleStart}
      onDrag={handleDrag}
      onStop={handleStop}
      bounds="parent"
    >
      <div
        className={classes.container}
        onClick={(e) => {e.preventDefault()}}
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
    margin: "5px",
    whiteSpace: "pre-wrap",
    padding:"0.5em 30px 0.5em",
    position:"relative",
    boxSizing:"border-box",
    boxShadow: "0 .25rem .25rem hsla(0, 0%, 0%, .1)",
    backgroundImage:
    "linear-gradient(180deg, hsla(0, 0%, 45%, .1) 0.5rem, hsla(0, 100%, 100%, 0) 2.5rem),linear-gradient(180deg, hsla(60, 100%, 85%, 1), hsla(60, 100%, 85%, 1))"
  }
});

export default StickyNote;
