import React, { useState, useContext, useEffect } from "react";
import { CanvasContext } from "../../contexts/CanvasContext";
import { TextField, Menu, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Rnd } from "react-rnd";
import { Textfit } from "react-textfit";
import LockButton from "./LockButton";

const CanvasObject = {
  StickyNotes: "stickyNotes",
  Lines: "lines",
  Labels: "labels",
} as const;

type CanvasObject = typeof CanvasObject[keyof typeof CanvasObject];

interface mouseState {
  mouseX: null | number;
  mouseY: null | number;
}

const initiaMouselState: mouseState = {
  mouseX: null,
  mouseY: null,
};

type LabelProps = {
  id: string;
  vh: string;
  positionX: number;
  positionY: number;
  zIndex: number;
  isEdit: boolean;
  word: string;
  width: number;
  height: number;
  isLocked: boolean;
  canvasId: string;
  isAreaClicked: boolean;
  setIsAreaClicked: (boolean) => void;
};

type DraggableData = {
  node: HTMLElement;
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  lastX: number;
  lastY: number;
};

type DraggableEventHandler = (e: any, data: DraggableData) => void | false;

const Label: React.FC<LabelProps> = (props) => {
  const classes = useStyles(props);
  const {
    moveCanvasObject,
    resizeCanvasObject,
    editCanvasObjectWord,
    deleteCanvasObject,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
  } = useContext(CanvasContext);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: props.positionX,
    y: props.positionY,
  });
  const [style, setStyle] = useState(classes.container);
  const [isEdit, setIsEdit] = useState<boolean>(props.isEdit);
  const [tempWord, setTempWord] = useState<string>(props.word);
  const [mouseState, setMouseState] = useState<mouseState>(initiaMouselState);
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: props.width,
    height: props.height,
  });
  const isLocked = props.isLocked;

  const handleStop: DraggableEventHandler = (e, d) => {
    const positionX = d.x;
    const positionY = d.y;
    if (position.x !== positionX || position.y !== positionY) {
      setPosition({ x: positionX, y: positionY });
      moveCanvasObject(
        props.canvasId,
        CanvasObject.Labels,
        props.id,
        positionX,
        positionY
      );
    }
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    const changedWidth = size.width + delta.width;
    const changedHeight = size.height + delta.height;
    const positionX = position.x;
    const positionY = position.y;
    if (size.width !== changedWidth || size.height !== changedHeight) {
      setSize({ width: changedWidth, height: changedHeight });
      setPosition({ x: positionX, y: positionY });
      resizeCanvasObject(
        props.canvasId,
        CanvasObject.Labels,
        props.id,
        positionX,
        positionY,
        changedWidth,
        changedHeight
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

  const word =
    !isLocked && isEdit ? (
      <TextField
        multiline={true}
        value={tempWord}
        onChange={(e) => {
          setTempWord(e.target.value);
        }}
        //onKeyDown={(e) => finishWordEdit(e)}

        // autoFocus={true}
        onFocus={(e) => {
          e.currentTarget.select();
        }}
      />
    ) : (
      <div id={props.id}>{tempWord}</div>
    );
  useEffect(() => {
    //編集状態を解除する
    if (props.isAreaClicked) {
      setIsEdit(false);
      if (props.word !== tempWord) {
        editCanvasObjectWord(
          props.canvasId,
          CanvasObject.Labels,
          props.id,
          tempWord
        );
      }
    }
  }, [props.isAreaClicked]);
  return (
    <Rnd
      style={{ zIndex: props.zIndex }}
      size={{
        width: size.width,
        height: size.height,
      }}
      position={{ x: position.x, y: position.y }}
      // onDragStart={handleStart}
      // onDrag={handleDrag}
      onDragStop={handleStop}
      onResizeStop={handleResizeStop}
      minHeight="50"
      minWidth="50"
      onMouseOver={() => {
        if (!isLocked && style !== classes.onHoverContainer) {
          setStyle(classes.onHoverContainer);
        }
      }}
      onMouseLeave={() => {
        if (!isLocked && style !== classes.container) {
          setStyle(classes.container);
        }
      }}
      id={props.id}
      // onMouseEnter={() => props.setDisabledPanZoom(true)}
      // onMouseLeave={() => props.setDisabledPanZoom(false)}
      disableDragging={isLocked}
      enableResizing={!isLocked}
    >
      <div
        onDoubleClick={(e) => {
          //console.log(e.target.id === props.id);
          setIsEdit(true);
          props.setIsAreaClicked(false);
        }}
        onContextMenu={handleClick}
      >
        <Textfit className={style}>{word}</Textfit>

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
            isLocked={props.isLocked}
            canvasId={props.canvasId}
            objName={CanvasObject.Labels}
            id={props.id}
          />
          <MenuItem
            disabled={isLocked}
            onClick={(e) => {
              setIsEdit(true);
              handleClose();
            }}
          >
            編集
          </MenuItem>
          <MenuItem
            disabled={isLocked}
            onClick={() => {
              bringForward(
                props.canvasId,
                CanvasObject.Labels,
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
              bringToFront(props.canvasId, CanvasObject.Labels, props.id);
            }}
          >
            最前面へ
          </MenuItem>
          <MenuItem
            disabled={isLocked}
            onClick={() => {
              sendBackward(
                props.canvasId,
                CanvasObject.Labels,
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
              sendToBack(props.canvasId, CanvasObject.Labels, props.id);
            }}
          >
            最背面へ
          </MenuItem>
          <MenuItem
            disabled={isLocked}
            onClick={() => {
              deleteCanvasObject(props.canvasId, CanvasObject.Labels, props.id);
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
    position: "absolute",
    boxSizing: "border-box",
    border: "1px solid transparent",
    height: "100%",
    width: "100%",
    padding: 5,
    zIndex: (props: LabelProps) => props.zIndex,
  },
  onHoverContainer: {
    position: "absolute",
    boxSizing: "border-box",
    border: "1px solid gray",
    height: "100%",
    width: "100%",
    padding: 5,
    zIndex: (props: LabelProps) => props.zIndex,
  },
});

export default Label;
