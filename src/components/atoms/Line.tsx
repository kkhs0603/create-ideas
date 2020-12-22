import React, { useState, useContext } from "react";
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
import { Rnd } from "react-rnd";

type Props = {
  canvasId: string;
  id: string;
  x: number;
  y: number;
  vh: string;
  zIndex: number;
};

const CanvasObject = {
  StickyNotes: "stickyNotes",
  Lines: "lines",
  Labels: "labels",
} as const;

type CanvasObject = typeof CanvasObject[keyof typeof CanvasObject];

const initiaMouselState = {
  mouseX: null,
  mouseY: null,
};

const Line: React.FC<Props> = (props) => {
  const [cursor, setCursor] = useState<string>("grab");
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: props.x,
    y: props.y,
  });
  const [mouseState, setMouseState] = useState<{
    mouseX: number;
    mouseY: number;
  }>(initiaMouselState);
  const classes = useStyles(props);
  const {
    moveCanvasObject,
    deleteCanvasObject,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
  } = useContext(CanvasContext);

  let lineClasses = classes.container;
  let axis = null;
  let width = null;
  let height = null;
  switch (props.vh) {
    case "vertical":
      lineClasses = classNames(classes.container, classes.vertical);
      width = "5px";
      height = "100%";
      axis = "x";
      break;
    case "horizontal":
      lineClasses = classNames(classes.container, classes.horizontal);
      axis = "y";
      width = "100%";
      height = "5px";
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
    moveCanvasObject(props.canvasId, CanvasObject.Lines, props.id, ui.x, ui.y);
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
    <Rnd
      dragAxis={axis}
      onDragStart={handleStart}
      onDrag={handleDrag}
      onDragStop={handleStop}
      position={{ x: position.x, y: position.y }}
      bounds="parent"
      style={{ zIndex: props.zIndex }}
      default={{ width: width, height: height }}
      enableResizing={false}
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
          <MenuItem
            onClick={() => {
              bringForward(
                props.canvasId,
                CanvasObject.Lines,
                props.id,
                props.zIndex
              );
            }}
          >
            前面へ
          </MenuItem>
          <MenuItem
            onClick={() => {
              bringToFront(props.canvasId, CanvasObject.Lines, props.id);
            }}
          >
            最前面へ
          </MenuItem>
          <MenuItem
            onClick={() => {
              sendBackward(
                props.canvasId,
                CanvasObject.Lines,
                props.id,
                props.zIndex
              );
            }}
          >
            背面へ
          </MenuItem>
          <MenuItem
            onClick={() => {
              sendToBack(props.canvasId, CanvasObject.Lines, props.id);
            }}
          >
            最後面へ
          </MenuItem>
          <MenuItem
            onClick={() => {
              deleteCanvasObject(props.canvasId, CanvasObject.Lines, props.id);
              handleClose();
            }}
          >
            線を削除
          </MenuItem>
        </Menu>
      </div>
    </Rnd>
  );
};

///////
//Style
///////
const useStyles = makeStyles({
  container: {
    position: "absolute",
    backgroundColor: "black",
    zIndex: (props: Props) => props.zIndex,
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
