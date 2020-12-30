import React, { useState, useContext, useEffect } from "react";
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
import LockButton from "./LockButton";

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
    x: props.positionX,
    y: props.positionY,
  });
  const [mouseState, setMouseState] = useState<{
    mouseX: number;
    mouseY: number;
  }>(initiaMouselState);
  const [isOpendMenu, setIsOpendMenu] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(props.isLocked);
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
      width = "100%";
      height = "5px";
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

  const handleStop = (e, d) => {
    setCursor("grab");
    const positionX = d.x;
    const positionY = d.y;
    if (position.x !== positionX || position.y !== positionY) {
      if (props.vh === "vertical") {
        setPosition({ x: positionX, y: 0 });
      } else if (props.vh === "horizontal") {
        setPosition({ x: 0, y: positionY });
      }
      moveCanvasObject(
        props.canvasId,
        CanvasObject.Lines,
        props.id,
        positionX,
        positionY
      );
    }
  };

  const handleClick = (e) => {
    setMouseState({
      mouseX: e.clientX - 2,
      mouseY: e.clientY - 4,
    });
    setIsOpendMenu(true);
  };

  const handleClose = () => {
    setMouseState(initiaMouselState);
  };

  useEffect(() => {}, []);

  return (
    <Rnd
      dragAxis={axis}
      onDragStart={handleStart}
      onDrag={handleDrag}
      onDragStop={handleStop}
      position={{ x: position.x, y: position.y }}
      bounds="parent"
      style={{ zIndex: props.zIndex }}
      size={{ width: width, height: height }}
      enableResizing={false}
      // onMouseEnter={() => props.setDisabledPanZoom(true)}
      // onMouseLeave={() => props.setDisabledPanZoom(false)}
      id="line"
      disableDragging={isLocked}
    >
      <div
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
          <LockButton
            isLocked={props.isLocked}
            canvasId={props.canvasId}
            objName={CanvasObject.Lines}
            id={props.id}
          />
          <MenuItem
            disabled={isLocked}
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
            disabled={isLocked}
            onClick={() => {
              bringToFront(props.canvasId, CanvasObject.Lines, props.id);
            }}
          >
            最前面へ
          </MenuItem>
          <MenuItem
            disabled={isLocked}
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
            disabled={isLocked}
            onClick={() => {
              sendToBack(props.canvasId, CanvasObject.Lines, props.id);
            }}
          >
            最後面へ
          </MenuItem>
          <MenuItem
            disabled={isLocked}
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
    width: (props) => 5,
    height: (props) => "100%",
    margin: "0px 5px",
  },
  horizontal: {
    width: (props) => "100%",
    height: (props) => 5,
    margin: "5px 0px",
  },
});

export default Line;
