import React, { useState, useContext, useRef, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { yellow, green, red, blue } from "@material-ui/core/colors";
import { CanvasContext } from "../../contexts/CanvasContext";
import { TextField, Menu, MenuItem, Radio, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import { Rnd } from "react-rnd";
import { Textfit } from "react-textfit";

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

const Label = (props) => {
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
  const [mouseState, setMouseState] = useState<{
    mouseX: number;
    mouseY: number;
  }>(initiaMouselState);
  const [isOpendMenu, setIsOpendMenu] = useState<boolean>(false);

  const handleStop = (e, d) => {
    if (position.x !== d.x || position.y !== d.y) {
      setPosition({ x: d.x, y: d.y });
      moveCanvasObject(props.canvasId, CanvasObject.Labels, props.id, d.x, d.y);
    }
  };
  const handleResizeStop = (e, direction, ref, delta, position) => {
    setPosition({ x: position.x, y: position.y });
    resizeCanvasObject(
      props.canvasId,
      CanvasObject.Labels,
      props.id,
      position.x,
      position.y,
      ref.style.width,
      ref.style.height
    );
  };

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

  const word = isEdit ? (
    <TextField
      multiline={true}
      value={tempWord}
      onChange={(e) => {
        setTempWord(e.target.value);
      }}
      //onKeyDown={(e) => finishWordEdit(e)}

      autoFocus={true}
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
      default={{ width: props.width, height: props.height }}
      position={{ x: position.x, y: position.y }}
      // onDragStart={handleStart}
      // onDrag={handleDrag}
      onDragStop={handleStop}
      onResizeStop={handleResizeStop}
      minHeight="50"
      minWidth="50"
      onMouseOver={() => {
        if (style !== classes.onHoverContainer) {
          setStyle(classes.onHoverContainer);
        }
      }}
      onMouseLeave={() => {
        if (style !== classes.container) {
          setStyle(classes.container);
        }
      }}
      id={props.id}
    >
      <div
        onDoubleClick={(e) => {
          console.log(e.target.id === props.id);
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
          <MenuItem
            onClick={(e) => {
              setIsEdit(true);
              handleClose();
            }}
          >
            編集
          </MenuItem>
          <MenuItem
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
            onClick={() => {
              bringToFront(props.canvasId, CanvasObject.Labels, props.id);
            }}
          >
            最前面へ
          </MenuItem>
          <MenuItem
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
            onClick={() => {
              sendToBack(props.canvasId, CanvasObject.Labels, props.id);
            }}
          >
            最背面へ
          </MenuItem>
          <MenuItem
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
    zIndex: (props: Props) => props.zIndex,
  },
  onHoverContainer: {
    position: "absolute",
    boxSizing: "border-box",
    border: "1px solid gray",
    height: "100%",
    width: "100%",
    padding: 5,
    zIndex: (props: Props) => props.zIndex,
  },
});

export default Label;
