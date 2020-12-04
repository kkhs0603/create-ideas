import React, { useState, useContext } from "react";
import Draggable from "react-draggable";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import { CanvasContext } from "../../contexts/CanvasContext";
import {
  Button,
  TextField,
  Menu,
  MenuItem,
  Radio,
  Divider,
} from "@material-ui/core";

const initiaMouselState = {
  mouseX: null,
  mouseY: null,
};

const Line = (props) => {
  const [cursor, setCursor] = useState("grab");
  const [position, setPosition] = useState({
    x: props.x,
    y: props.y,
  });
  const [mouseState, setMouseState] = useState(initiaMouselState);
  const classes = useStyles();
  const { moveLine, deleteLine } = useContext(CanvasContext);

  let lineClasses = classes.container;
  let axis = null;
  switch (props.vh) {
    case "vertical":
      lineClasses = classNames(classes.container, classes.vertical);
      axis = "x";
      break;
    case "horizontal":
      lineClasses = classNames(classes.container, classes.horizontal);
      axis = "y";
      break;
    default:
      lineClasses = classes.container;
      break;
  }

  const handleStart = () => {
    setCursor("grabbing");
  };

  const handleDrag = () => {
    setCursor("grabbing");
  };

  const handleStop = (e, ui) => {
    setCursor("grab");
    if (props.x === ui.x && props.y === ui.y) return;
    if (props.vh === "vertical") {
      setPosition({ x: ui.x, y: 0 });
    } else if (props.vh === "horizontal") {
      setPosition({ x: 0, y: ui.y });
    }
    moveLine(props.canvasId, props.id, ui.x, ui.y);
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (e.target.id !== "line") return;
    setMouseState({
      mouseX: e.clientX - 2,
      mouseY: e.clientY - 4,
    });
  };

  const handleClose = () => {
    setMouseState(initiaMouselState);
  };

  return (
    <Draggable
      axis={axis}
      onStart={handleStart}
      onDrag={handleDrag}
      onStop={handleStop}
      position={{ x: position.x, y: position.y }}
      bounds="parent"
    >
      <div
        id="line"
        className={lineClasses}
        style={{ cursor: cursor }}
        onContextMenu={handleClick}
      >
        <Menu
          keepMounted
          open={mouseState.mouseY !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            mouseState.mouseY !== null && mouseState.mouseX !== null
              ? { top: mouseState.mouseY, left: mouseState.mouseX }
              : undefined
          }
        >
          <MenuItem disabled></MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              deleteLine(props.canvasId, props.id);
              handleClose();
            }}
          >
            線を削除
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
    position: "absolute",
    backgroundColor: "black",
  },
  vertical: {
    width: "5px",
    height: "100%",
    margin: "0px 5px",
  },
  horizontal: {
    width: "100%",
    height: "5px",
    margin: "5px 0px",
  },
});

export default Line;
