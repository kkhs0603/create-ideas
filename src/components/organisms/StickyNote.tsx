import React, { useState, useContext, useRef, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { yellow, green, red, blue } from "@material-ui/core/colors";
import { CanvasContext } from "../../contexts/CanvasContext";
import { TextField, Menu, MenuItem, Radio, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import { Rnd } from "react-rnd";

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
    moveStickyNote,
    deleteStickyNote,
    changeStickyNoteColor,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    editStickyNoteWord,
    resizeStickyNote,
  } = useContext(CanvasContext);
  const [mouseState, setMouseState] = useState<{
    mouseX: number;
    mouseY: number;
  }>(initiaMouselState);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: props.data.positionX,
    y: props.data.positionY,
  });
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: props.data.width,
    height: props.data.height,
  });
  const [cursor, setCursor] = useState<string>("grab");
  const [isOpendMenu, setIsOpendMenu] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>(props.data.color);
  const [isEdit, setIsEdit] = useState<boolean>(props.isEdit);
  const [tempWord, setTempWord] = useState<string>(props.data.word);

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
    if (position.x !== d.x || position.y !== d.y) {
      setPosition({ x: d.x, y: d.y });
      moveStickyNote(props.canvasId, props.data.id, d.x, d.y);
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

  const handleResizeStop = (e, direction, ref, delta, position) => {
    setSize({ width: ref.style.width, height: ref.style.height });
    setPosition({ x: position.x, y: position.y });
    resizeStickyNote(
      props.canvasId,
      props.data.id,
      position.x,
      position.y,
      ref.style.width,
      ref.style.height
    );
  };

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
      autoFocus={true}
      onFocus={(e) => {
        e.currentTarget.select();
      }}
    />
  ) : (
    <div id={props.data.id}>{tempWord}</div>
  );

  useEffect(() => {
    //編集状態を解除する
    if (props.isAreaClicked) {
      setIsEdit(false);
      if (props.data.word !== tempWord) {
        editStickyNoteWord(props.canvasId, props.data.id, tempWord);
      }
    }
  }, [props.isAreaClicked]);
  return (
    <Rnd
      style={{ zIndex: props.data.zIndex }}
      default={{ width: props.data.width, height: props.data.height }}
      position={{ x: position.x, y: position.y }}
      onDragStart={handleStart}
      onDrag={handleDrag}
      onDragStop={handleStop}
      onResizeStop={handleResizeStop}
      minHeight="50"
      minWidth="50"
    >
      <div
        id={props.data.id}
        className={color}
        style={{ cursor: cursor }}
        onContextMenu={handleClick}
        onClick={() => {
          props.setIsAreaClicked(false);
        }}
        onDoubleClick={(e) => {
          console.log(e.target.id === props.data.id);
          setIsEdit(e.target.id === props.data.id);
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
                "stickyNotes",
                props.data.id,
                props.data.zIndex
              );
            }}
          >
            前面へ
          </MenuItem>
          <MenuItem
            onClick={() => {
              bringToFront(props.canvasId, "stickyNotes", props.data.id);
            }}
          >
            最前面へ
          </MenuItem>
          <MenuItem
            onClick={() => {
              sendBackward(
                props.canvasId,
                "stickyNotes",
                props.data.id,
                props.data.zIndex
              );
            }}
          >
            背面へ
          </MenuItem>
          <MenuItem
            onClick={() => {
              sendToBack(props.canvasId, "stickyNotes", props.data.id);
            }}
          >
            最背面へ
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
              deleteStickyNote(props.canvasId, props.data.id);
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
    //userSelect: "none",
    // margin: "5px",
    whiteSpace: "pre-wrap",
    // padding: "0.5em 30px 0.5em",
    position: "absolute",
    boxSizing: "border-box",
    boxShadow: "0 .25rem .25rem hsla(0, 0%, 0%, .1)",
    border: "1px solid black",
    height: "100%",
    width: "100%",
    zIndex: (props: Props) => props.data.zIndex,
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
