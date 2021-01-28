// @ts-nocheck
import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import { MaterialsContext } from "../../contexts/MaterialsContext";
import { Menu, MenuItem } from "@material-ui/core";
import { Rnd } from "react-rnd";
import LockButton from "./LockButton";

type LineProps = {
  canvasId: string;
  id: string;
  x: number;
  y: number;
  vh: string;
  zIndex: number;
  positionX: number;
  positionY: number;
  isLocked: boolean;
  areaSize: { height: number; width: number };
};

const Material = {
  StickyNotes: "stickyNotes",
  Lines: "lines",
  Labels: "labels",
} as const;

type Material = typeof Material[keyof typeof Material];

const initiaMouselState = {
  mouseX: null,
  mouseY: null,
};

const Line: React.FC<LineProps> = (props) => {
  const [cursor, setCursor] = useState<string>("grab");
  const [lineProps, setLineProps] = useState<LineProps>({
    canvasId: props.canvasId,
    id: props.id,
    positionX: props.positionX,
    positionY: props.positionY,
    vh: props.vh,
    zIndex: props.zIndex,
    isLocked: props.isLocked,
  });
  const [mouseState, setMouseState] = useState<{
    mouseX: number;
    mouseY: number;
  }>(initiaMouselState);
  const [isOpendMenu, setIsOpendMenu] = useState<boolean>(false);
  const classes = useStyles(props);
  const {
    moveMaterial,
    deleteMaterial,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
  } = useContext(MaterialsContext);

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
    if (isNaN(positionX) || isNaN(positionY)) return;
    if (
      lineProps.positionX !== positionX ||
      lineProps.positionY !== positionY
    ) {
      if (props.vh === "vertical") {
        setLineProps({ ...lineProps, positionX, positionY: 0 });
      } else if (props.vh === "horizontal") {
        setLineProps({ ...lineProps, positionX: 0, positionY });
      }
      moveMaterial(
        props.canvasId,
        Material.Lines,
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
  };

  const handleClose = () => {
    setMouseState(initiaMouselState);
  };

  useEffect(() => {
    setLineProps(props);
  }, [props]);

  return (
    <Rnd
      dragAxis={axis}
      onDragStart={handleStart}
      onDrag={handleDrag}
      onDragStop={handleStop}
      position={{ x: lineProps.positionX, y: lineProps.positionY }}
      bounds="parent"
      style={{ zIndex: props.zIndex }}
      size={{ width: width, height: height }}
      enableResizing={false}
      id="line"
      disableDragging={lineProps.isLocked}
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
            isLocked={lineProps.isLocked}
            canvasId={props.canvasId}
            objName={Material.Lines}
            id={props.id}
          />
          <MenuItem
            disabled={lineProps.isLocked}
            onClick={() => {
              bringForward(
                props.canvasId,
                Material.Lines,
                props.id,
                props.zIndex
              );
            }}
          >
            前面へ
          </MenuItem>
          <MenuItem
            disabled={lineProps.isLocked}
            onClick={() => {
              bringToFront(props.canvasId, Material.Lines, props.id);
            }}
          >
            最前面へ
          </MenuItem>
          <MenuItem
            disabled={lineProps.isLocked}
            onClick={() => {
              sendBackward(
                props.canvasId,
                Material.Lines,
                props.id,
                props.zIndex
              );
            }}
          >
            背面へ
          </MenuItem>
          <MenuItem
            disabled={lineProps.isLocked}
            onClick={() => {
              sendToBack(props.canvasId, Material.Lines, props.id);
            }}
          >
            最後面へ
          </MenuItem>
          <MenuItem
            disabled={lineProps.isLocked}
            onClick={() => {
              deleteMaterial(props.canvasId, Material.Lines, props.id);
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
    zIndex: (props: LineProps) => props.zIndex,
  },
  vertical: {
    width: 5,
    height: (props: LineProps) =>
      props.areaSize ? props.areaSize.height : "100%",
    margin: "0px 5px",
  },
  horizontal: {
    width: (props: LineProps) =>
      props.areaSize ? props.areaSize.width : "100%",
    height: 5,
    margin: "5px 0px",
  },
});

export default Line;
