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

const StickyNote: React.FC<any> = (props) => {
  const classes = useStyles(props);
  const {
    moveMaterial,
    deleteMaterial,
    editMaterialWord,
    resizeMaterial,
    changeStickyNoteColor,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
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
        Material.StickyNotes,
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
        Material.StickyNotes,
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
      if (stickyNoteProps.word === "" || props.word !== stickyNoteProps.word) {
        editMaterialWord(
          props.canvasId,
          Material.StickyNotes,
          props.id,
          e.target.value
        );
      }
      setIsEdit(false);
    }
  };

  const word = isEdit ? (
    <textarea
      style={{
        width: stickyNoteProps.width,
        height: stickyNoteProps.height,
        backgroundColor: "transparent",
        resize: "none",
      }}
      value={stickyNoteProps.word}
      onChange={(e) => {
        setStickyNoteProps({ ...stickyNoteProps, word: e.target.value });
      }}
      onKeyDown={(e) => finishWordEdit(e)}
      autoFocus
      onFocus={(e) =>
        e.currentTarget.setSelectionRange(
          e.currentTarget.value.length,
          e.currentTarget.value.length
        )
      }
    />
  ) : (
    <div id={props.id}>{stickyNoteProps.word}</div>
  );
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
          Material.StickyNotes,
          props.id,
          stickyNoteProps.word
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
        width: stickyNoteProps.width,
        height: stickyNoteProps.height,
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
            isLocked={stickyNoteProps.isLocked}
            canvasId={props.canvasId}
            objName={Material.StickyNotes}
            id={props.id}
          />
          <MenuItem
            disabled={stickyNoteProps.isLocked}
            onClick={(e) => {
              setIsEdit(true);
              handleClose();
            }}
          >
            編集
          </MenuItem>
          <MenuItem
            disabled={stickyNoteProps.isLocked}
            onClick={() => {
              bringForward(
                props.canvasId,
                Material.StickyNotes,
                props.id,
                props.zIndex
              );
            }}
          >
            前面へ
          </MenuItem>
          <MenuItem
            disabled={stickyNoteProps.isLocked}
            onClick={() => {
              bringToFront(props.canvasId, Material.StickyNotes, props.id);
            }}
          >
            最前面へ
          </MenuItem>
          <MenuItem
            disabled={stickyNoteProps.isLocked}
            onClick={() => {
              sendBackward(
                props.canvasId,
                Material.StickyNotes,
                props.id,
                props.zIndex
              );
            }}
          >
            背面へ
          </MenuItem>
          <MenuItem
            disabled={stickyNoteProps.isLocked}
            onClick={() => {
              sendToBack(props.canvasId, Material.StickyNotes, props.id);
            }}
          >
            最背面へ
          </MenuItem>
          <Divider />
          <MenuItem disabled>付箋の色</MenuItem>
          <YellowRadio
            checked={stickyNoteProps.color === "yellow"}
            disabled={stickyNoteProps.isLocked}
            onChange={handleChangeColor}
            value="yellow"
          />
          <GreenRadio
            disabled={stickyNoteProps.isLocked}
            checked={stickyNoteProps.color === "green"}
            onChange={handleChangeColor}
            value="green"
          />
          <RedRadio
            disabled={stickyNoteProps.isLocked}
            checked={stickyNoteProps.color === "red"}
            onChange={handleChangeColor}
            value="red"
          />
          <BlueRadio
            disabled={stickyNoteProps.isLocked}
            checked={stickyNoteProps.color === "blue"}
            onChange={handleChangeColor}
            value="blue"
          />
          <Divider />
          <MenuItem
            disabled={stickyNoteProps.isLocked}
            onClick={() => {
              deleteMaterial(props.canvasId, Material.StickyNotes, props.id);
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
