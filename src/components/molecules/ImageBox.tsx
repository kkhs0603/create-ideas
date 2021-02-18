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
import { atom } from "recoil";
import FrontBackContextMenuItems from "../atoms/FrontBackContextMenuItems";
import { MaterialType } from "../../MaterialTypeEnum";

export const stickyNoteState = atom({
  key: "stickyNoteState",
  default: {
    color: "",
    createdBy: "",
    height: 0,
    width: 0,
    id: "",
    isEdit: false,
    word: "",
    zIndex: 0,
    positionX: 0,
    positionY: 0,
  },
});
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

type StickyNoteProps = {
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

const initiaMouselState = {
  mouseX: null,
  mouseY: null,
};

const ImageBox: React.FC<any> = (props) => {
  const classes = useStyles(props);
  const {
    moveMaterial,
    deleteMaterial,
    editMaterialWord,
    resizeMaterial,
  } = useContext(MaterialsContext);
  const [mouseState, setMouseState] = useState<{
    mouseX: number;
    mouseY: number;
  }>(initiaMouselState);
  const [cursor, setCursor] = useState<string>("grab");
  const [isOpendMenu, setIsOpendMenu] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [stickyNoteProps, setStickyNoteProps] = useState<StickyNoteProps>({
    positionX: props.positionX,
    positionY: props.positionY,
    width: props.width,
    height: props.height,
    selectedColor: props.color,
    word: props.word,
    isLocked: props.isLocked,
  });

  const handleClick = (e) => {
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
    props.setIsAreaClicked(false);
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
      stickyNoteProps.positionX !== positionX ||
      stickyNoteProps.positionY !== positionY
    ) {
      setStickyNoteProps({
        ...stickyNoteProps,
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

  let color = classNames(classes.yellow, classes.container);
  switch (props.color) {
    case "yellow":
      color = classNames(classes.yellow, classes.container);
      break;
    case "green":
      color = classNames(classes.green, classes.container);
      break;
    case "red":
      color = classNames(classes.red, classes.container);
      break;
    case "blue":
      color = classNames(classes.blue, classes.container);
      break;
    default:
      color = classNames(classes.yellow, classes.container);
      break;
  }

  const handleResizeStop = (e, direction, ref, delta, position) => {
    const changedWidth = stickyNoteProps.width + delta.width;
    const changedHeight = stickyNoteProps.height + delta.height;
    const positionX = position.x;
    const positionY = position.y;
    if (isNaN(positionX) || isNaN(positionY)) return;
    if (
      stickyNoteProps.width !== changedWidth ||
      stickyNoteProps.height !== changedHeight
    ) {
      setStickyNoteProps({
        ...stickyNoteProps,
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
    setStickyNoteProps(props);
  }, [props]);

  useEffect(() => {
    //編集状態を解除する
    if (props.isAreaClicked) {
      setIsEdit(false);
      if (props.word !== stickyNoteProps.word) {
        setStickyNoteProps({ ...stickyNoteProps, word: stickyNoteProps.word });
        editMaterialWord(
          props.canvasId,
          MaterialType.ImageBox,
          props.id,
          stickyNoteProps.word
        );
      }
    }
  }, [props.isAreaClicked]);
  return (
    <Rnd
      style={{
        zIndex: 1,
      }}
      size={{
        width: 100,
        height: 100,
      }}
      position={{ x: stickyNoteProps.positionX, y: stickyNoteProps.positionY }}
      onDragStart={handleStart}
      onDrag={handleDrag}
      onDragStop={handleStop}
      onResizeStop={handleResizeStop}
      minHeight="50"
      minWidth="50"
      disableDragging={stickyNoteProps.isLocked}
      enableResizing={!stickyNoteProps.isLocked}
      bounds="parent"
    >
      <div
        id={props.id}
        className={color}
        style={{ cursor: cursor }}
        onContextMenu={handleClick}
        onClick={() => {
          props.setIsAreaClicked(false);
        }}
        onDoubleClick={(e) => {
          setIsEdit(e.target.id === props.id);
          props.setIsAreaClicked(false);
        }}
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
            isLocked={stickyNoteProps.isLocked}
            canvasId={props.canvasId}
            objName={MaterialType.ImageBox}
            id={props.id}
          />
          <Divider />
          <FrontBackContextMenuItems
            materialType={MaterialType.ImageBox}
            canvasId={props.canvasId}
            {...stickyNoteProps}
          />
          <MenuItem
            disabled={stickyNoteProps.isLocked}
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
    border: "1px solid black",
    height: "100%",
    width: "100%",
    zIndex: (props: Props) => props.zIndex,
  },
});

export default ImageBox;
