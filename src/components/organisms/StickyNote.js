import React, { useState, useContext, useRef, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { yellow, green, red, blue } from "@material-ui/core/colors";
import { CanvasContext } from "../../contexts/CanvasContext";
import {
  Button,
  TextField,
  Menu,
  MenuItem,
  Radio,
  Divider,
  InputBase,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Draggable from "react-draggable";
import classNames from "classnames";

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

const StickyNote = (props) => {
  const classes = useStyles(props);
  const {
    moveStickyNote,
    deleteWord,
    changeStickyNoteColor,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    editStickyNoteWord,
  } = useContext(CanvasContext);
  const [mouseState, setMouseState] = useState(initiaMouselState);
  const [position, setPosition] = useState({
    x: props.data.positionX,
    y: props.data.positionY,
  });
  const [cursor, setCursor] = useState("grab");
  const [isOpendMenu, setIsOpendMenu] = useState(false);
  const [selectedColor, setSelectedColor] = useState(props.data.color);
  const [isEdit, setIsEdit] = useState(false);
  const [tempWord, setTempWord] = useState(props.data.word);

  const handleClick = (e) => {
    setIsOpendMenu(true);
    if (e.target.id !== "stickyNote") return;
    props.setIsAreaClicked(false);
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

  const handleStop = (e, ui) => {
    if (position.x !== ui.x || position.y !== ui.y) {
      setPosition({ x: ui.x, y: ui.y });
      moveStickyNote(props.canvasId, props.data.id, ui.x, ui.y);
    }
    setCursor("grab");
  };

  const handleChangeColor = (event) => {
    changeStickyNoteColor(props.canvasId, props.data.id, event.target.value);
  };

  let color = classNames(classes.yellow, classes.container);
  switch (props.data.color) {
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

  const finishWordEdit = (e) => {
    if (
      ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) &&
      e.key === "Enter"
    ) {
      if (props.data.word !== tempWord) {
        editStickyNoteWord(props.canvasId, props.data.id, e.target.value);
      }
      setIsEdit(false);
    }
  };

  const word = isEdit ? (
    props.isAreaClicked ? (
      <div>{tempWord}</div>
    ) : (
      <TextField
        multiline={true}
        value={tempWord}
        onChange={(e) => {
          setTempWord(e.target.value);
        }}
        onKeyDown={(e) => finishWordEdit(e)}
        style={{ width: 100 }}
      />
    )
  ) : (
    <div>{tempWord}</div>
  );

  useEffect(() => {
    //編集状態を解除する
    setIsEdit(false);
    setTempWord(props.data.word);
  }, [props.isAreaClicked]);
  return (
    <Draggable
      position={{ x: position.x, y: position.y }}
      onStart={handleStart}
      onDrag={handleDrag}
      onStop={handleStop}
    >
      <div
        id={"stickyNote"}
        className={color}
        style={{ cursor: cursor }}
        onContextMenu={handleClick}
        onClick={() => {
          props.setIsAreaClicked(false);
        }}
        onDoubleClick={() => {
          setIsEdit(true);
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
          <MenuItem
            onClick={() => {
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
                "words",
                props.data.id,
                props.data.zIndex
              );
            }}
          >
            前面へ
          </MenuItem>
          <MenuItem
            onClick={() => {
              bringToFront(props.canvasId, "words", props.data.id);
            }}
          >
            最前面へ
          </MenuItem>
          <MenuItem
            onClick={() => {
              sendBackward(
                props.canvasId,
                "words",
                props.data.id,
                props.data.zIndex
              );
            }}
          >
            背面へ
          </MenuItem>
          <MenuItem
            onClick={() => {
              sendToBack(props.canvasId, "words", props.data.id);
            }}
          >
            最後面へ
          </MenuItem>
          <Divider />
          <MenuItem disabled>付箋の色</MenuItem>
          <YellowRadio
            checked={selectedColor === "yellow"}
            onChange={handleChangeColor}
            value="yellow"
          />
          <GreenRadio
            checked={selectedColor === "green"}
            onChange={handleChangeColor}
            value="green"
          />
          <RedRadio
            checked={selectedColor === "red"}
            onChange={handleChangeColor}
            value="red"
          />
          <BlueRadio
            checked={selectedColor === "blue"}
            onChange={handleChangeColor}
            value="blue"
          />
          <Divider />
          <MenuItem
            onClick={() => {
              deleteWord(props.canvasId, props.data.id);
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
    userSelect: "none",
    margin: "5px",
    whiteSpace: "pre-wrap",
    padding: "0.5em 30px 0.5em",
    position: "absolute",
    boxSizing: "border-box",
    boxShadow: "0 .25rem .25rem hsla(0, 0%, 0%, .1)",
    border: "1px solid black",
    zIndex: (props) => props.data.zIndex,
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
