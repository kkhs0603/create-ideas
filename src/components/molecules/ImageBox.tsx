// @ts-nocheck
import React, { useState, useContext, useRef, useEffect, useMemo } from "react";
import { withStyles } from "@material-ui/core/styles";
import { yellow, green, red, blue } from "@material-ui/core/colors";
import { MaterialsContext } from "../../contexts/MaterialsContext";
import { TextField, Menu, MenuItem, Radio, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import { Rnd } from "react-rnd";
import LockButton from "../atoms/LockButton";
import FrontBackContextMenuItems from "../atoms/FrontBackContextMenuItems";
import { MaterialType } from "../../MaterialTypeEnum";

type Props = {
  canvasId: string;
  setIsAreaClicked: (isAreaClicked: boolean) => void;
  isAreaClicked: boolean;
  data: {
    color: string;
    createdBy: string;
    height: number;
    width: number;
    id: string;
    isEdit: boolean;
    word: string;
    zIndex: number;
    positionX: number;
    positionY: number;
  };
};

type ImageBoxProps = {
  createdBy: string;
  height: number;
  width: number;
  id: string;
  isEdit: boolean;
  zIndex: number;
  positionX: number;
  positionY: number;
};

const initiaMouselState = {
  mouseX: null,
  mouseY: null,
};

const ImageBox: React.FC<any> = (props) => {
  const classes = useStyles(props);
  const { moveMaterial, deleteMaterial, resizeMaterial } = useContext(
    MaterialsContext
  );
  const [mouseState, setMouseState] = useState<{
    mouseX: number;
    mouseY: number;
  }>(initiaMouselState);
  const [cursor, setCursor] = useState<string>("grab");
  const [isOpendMenu, setIsOpendMenu] = useState<boolean>(false);

  const [imageBoxProps, setImageBoxProps] = useState<ImageBoxProps>({
    positionX: props.positionX,
    positionY: props.positionY,
    width: props.width,
    height: props.height,
    isLocked: props.isLocked,
  });

  const handleClick = (e) => {
    e.preventDefault();
    setIsOpendMenu(true);
    setMouseState({
      mouseX: e.clientX - 2,
      mouseY: e.clientY - 4,
    });
  };

  const handleClose = () => {
    setIsOpendMenu(false);
    setMouseState(initiaMouselState);
  };

  const handleStart = () => {
    if (isOpendMenu) return false;
    setCursor("grabbing");
  };

  const handleDrag = () => {
    if (cursor !== "grabbing") {
      setCursor("grabbing");
    }
  };

  const handleStop = (e, d) => {
    const positionX = d.x;
    const positionY = d.y;
    if (isNaN(positionX) || isNaN(positionY)) return;
    if (
      imageBoxProps.positionX !== positionX ||
      imageBoxProps.positionY !== positionY
    ) {
      setImageBoxProps({
        ...imageBoxProps,
        positionX: positionX,
        positionY: positionY,
      });
      moveMaterial(
        props.canvasId,
        MaterialType.ImageBox,
        props.id,
        positionX,
        positionY
      );
    }
    setCursor("grab");
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    const changedWidth = imageBoxProps.width + delta.width;
    const changedHeight = imageBoxProps.height + delta.height;
    const positionX = position.x;
    const positionY = position.y;
    if (isNaN(positionX) || isNaN(positionY)) return;
    if (
      imageBoxProps.width !== changedWidth ||
      imageBoxProps.height !== changedHeight
    ) {
      setImageBoxProps({
        ...imageBoxProps,
        width: changedWidth,
        height: changedHeight,
        positionX,
        positionY,
      });
      resizeMaterial(
        props.canvasId,
        MaterialType.ImageBox,
        props.id,
        positionX,
        positionY,
        changedWidth,
        changedHeight
      );
    }
  };

  useEffect(() => {
    // console.log(props);
    setImageBoxProps(props);
  }, [props]);

  return (
    <Rnd
      style={{
        zIndex: props.zIndex,
      }}
      size={{
        width: imageBoxProps.width,
        height: imageBoxProps.height,
      }}
      position={{ x: imageBoxProps.positionX, y: imageBoxProps.positionY }}
      onDragStart={handleStart}
      onDrag={handleDrag}
      onDragStop={handleStop}
      onResizeStop={handleResizeStop}
      minHeight="50"
      minWidth="50"
      disableDragging={imageBoxProps.isLocked}
      enableResizing={!imageBoxProps.isLocked}
      bounds="parent"
    >
      <div
        id={props.id}
        className={classes.container}
        style={{ cursor: cursor }}
        onContextMenu={handleClick}
      >
        <img
          style={{ width: "100%", height: "100%" }}
          src={props.resource}
          alt={props.id}
        />
        <Menu
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
            isLocked={imageBoxProps.isLocked}
            canvasId={props.canvasId}
            objName={MaterialType.ImageBox}
            id={props.id}
          />
          <Divider />
          <FrontBackContextMenuItems
            materialType={MaterialType.ImageBox}
            canvasId={props.canvasId}
            {...imageBoxProps}
          />
          <MenuItem
            disabled={imageBoxProps.isLocked}
            onClick={() => {
              deleteMaterial(props.canvasId, MaterialType.ImageBox, props.id);
              handleClose();
            }}
          >
            削除
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
    whiteSpace: "pre-wrap",
    position: "absolute",
    boxSizing: "border-box",
    height: "100%",
    width: "100%",
    zIndex: (props: Props) => props.zIndex,
  },
});

export default ImageBox;
