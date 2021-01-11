import React, { useState, useContext, useRef, useEffect, useMemo } from "react";
import { withStyles } from "@material-ui/core/styles";
import { yellow, green, red, blue } from "@material-ui/core/colors";
import { CanvasContext } from "../../contexts/CanvasContext";
import { TextField, Menu, MenuItem, Radio, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import { Rnd } from "react-rnd";
import LockButton from "../atoms/LockButton";

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

const GreenRadio = withStyles({
  root: {
    color: green[400],
    "&$checked": {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);
const YellowRadio = withStyles({
  root: {
    color: yellow[400],
    "&$checked": {
      color: yellow[600],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);
const RedRadio = withStyles({
  root: {
    color: red[400],
    "&$checked": {
      color: red[600],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);
const BlueRadio = withStyles({
  root: {
    color: blue[400],
    "&$checked": {
      color: blue[600],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const StickyNote: React.FC<Props> = (props) => {
  const classes = useStyles(props);
  const {
    moveCanvasObject,
    deleteCanvasObject,
    editCanvasObjectWord,
    resizeCanvasObject,
    changeStickyNoteColor,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
  } = useContext(CanvasContext);
  const [mouseState, setMouseState] = useState<{
    mouseX: number;
    mouseY: number;
  }>(initiaMouselState);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: props.positionX,
    y: props.positionY,
  });
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: props.width,
    height: props.height,
  });
  const [cursor, setCursor] = useState<string>("grab");
  const [isOpendMenu, setIsOpendMenu] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>(props.color);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [tempWord, setTempWord] = useState<string>(props.word);
  const [isLocked, setIsLocked] = useState<boolean>(props.isLocked);

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
    if (position.x !== positionX || position.y !== positionY) {
      setPosition({ x: positionX, y: positionY });
      moveCanvasObject(
        props.canvasId,
        CanvasObject.StickyNotes,
        props.id,
        positionX,
        positionY
      );
    }
    setCursor("grab");
  };

  const handleChangeColor = (event) => {
    changeStickyNoteColor(props.canvasId, props.id, event.target.value);
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
    const changedWidth = size.width + delta.width;
    const changedHeight = size.height + delta.height;
    const positionX = position.x;
    const positionY = position.y;
    if (size.width !== changedWidth || size.height !== changedHeight) {
      setSize({ width: changedWidth, height: changedHeight });
      setPosition({ x: positionX, y: positionY });
      resizeCanvasObject(
        props.canvasId,
        CanvasObject.StickyNotes,
        props.id,
        positionX,
        positionY,
        changedWidth,
        changedHeight
      );
    }
  };

  const finishWordEdit = (e) => {
    if (
      ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) &&
      e.key === "Enter"
    ) {
      if (tempWord === "" || props.word !== tempWord) {
        editCanvasObjectWord(
          props.canvasId,
          CanvasObject.StickyNotes,
          props.id,
          e.target.value
        );
      }
      setIsEdit(false);
    }
  };

  const word = isEdit ? (
    <TextField
      multiline={true}
      value={tempWord}
      onChange={(e) => {
        setTempWord(e.target.value);
      }}
      onKeyDown={(e) => finishWordEdit(e)}
      style={{
        width: "100%",
        height: "100%",
        padding: 0,
        margin: 0,
      }}
      // autoFocus={true}
      onFocus={(e) => {
        e.currentTarget.select();
      }}
    />
  ) : (
    <div id={props.id}>{tempWord}</div>
  );
  // useEffect(() => {
  //   console.log("test");
  // }, [props]);

  useEffect(() => {
    //編集状態を解除する
    if (props.isAreaClicked) {
      setIsEdit(false);
      if (props.word !== tempWord) {
        editCanvasObjectWord(
          props.canvasId,
          CanvasObject.StickyNotes,
          props.id,
          tempWord
        );
      }
    }
  }, [props.isAreaClicked]);

  return (
    <Rnd
      style={{
        zIndex: props.zIndex,
      }}
      size={{
        width: size.width,
        height: size.height,
      }}
      position={{ x: position.x, y: position.y }}
      onDragStart={handleStart}
      onDrag={handleDrag}
      onDragStop={handleStop}
      onResizeStop={handleResizeStop}
      minHeight="50"
      minWidth="50"
      disableDragging={isLocked}
      enableResizing={!isLocked}
      // onMouseEnter={() => props.setDisabledPanZoom(true)}
      // onMouseLeave={() => props.setDisabledPanZoom(false)}
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
          console.log(e.target.id === props.id);
          setIsEdit(e.target.id === props.id);
          props.setIsAreaClicked(false);
        }}
      >
        {word}
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
            objName={CanvasObject.StickyNotes}
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
                CanvasObject.StickyNotes,
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
              bringToFront(props.canvasId, CanvasObject.StickyNotes, props.id);
            }}
          >
            最前面へ
          </MenuItem>
          <MenuItem
            disabled={isLocked}
            onClick={() => {
              sendBackward(
                props.canvasId,
                CanvasObject.StickyNotes,
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
              sendToBack(props.canvasId, CanvasObject.StickyNotes, props.id);
            }}
          >
            最背面へ
          </MenuItem>
          <Divider />
          <MenuItem disabled>付箋の色</MenuItem>
          <YellowRadio
            checked={selectedColor === "yellow"}
            disabled={isLocked}
            onChange={handleChangeColor}
            value="yellow"
          />
          <GreenRadio
            disabled={isLocked}
            checked={selectedColor === "green"}
            onChange={handleChangeColor}
            value="green"
          />
          <RedRadio
            disabled={isLocked}
            checked={selectedColor === "red"}
            onChange={handleChangeColor}
            value="red"
          />
          <BlueRadio
            disabled={isLocked}
            checked={selectedColor === "blue"}
            onChange={handleChangeColor}
            value="blue"
          />
          <Divider />
          <MenuItem
            disabled={isLocked}
            onClick={() => {
              deleteCanvasObject(
                props.canvasId,
                CanvasObject.StickyNotes,
                props.id
              );
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
  yellow: {
    backgroundColor: "#FFFCB3",
  },
  red: {
    backgroundColor: "#F6C0AF",
  },
  green: {
    backgroundColor: "#CDFDB3",
  },
  blue: {
    backgroundColor: "#AEDCF4",
  },
});

export default StickyNote;
