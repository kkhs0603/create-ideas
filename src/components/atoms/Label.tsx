// @ts-nocheck
import React, { useState, useContext, useEffect } from "react";
import { MaterialsContext } from "../../contexts/MaterialsContext";
import { TextField, Menu, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Rnd } from "react-rnd";
import { Textfit } from "react-textfit";
import LockButton from "./LockButton";

const Material = {
  StickyNotes: "stickyNotes",
  Lines: "lines",
  Labels: "labels",
} as const;

type Material = typeof Material[keyof typeof Material];

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
    moveMaterial,
    resizeMaterial,
    editMaterialWord,
    deleteMaterial,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
  } = useContext(MaterialsContext);
  const [style, setStyle] = useState(classes.container);
  const [isEdit, setIsEdit] = useState<boolean>(props.isEdit);
  const [mouseState, setMouseState] = useState<mouseState>(initiaMouselState);
  const [fontSize, setFontSize] = useState<number>(0);
  const [labelProps, setLabelProps] = useState<LabelProps>({
    positionX: props.positionX,
    positionY: props.positionY,
    width: props.width,
    height: props.height,
    selectedColor: props.color,
    word: props.word,
    isLocked: props.isLocked,
  });

  const handleStop: DraggableEventHandler = (e, d) => {
    const positionX = d.x;
    const positionY = d.y;
    if (
      labelProps.positionX !== positionX ||
      labelProps.positionY !== positionY
    ) {
      setLabelProps({ ...labelProps, positionX, positionY });
      moveMaterial(
        props.canvasId,
        Material.Labels,
        props.id,
        positionX,
        positionY
      );
    }
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    const changedWidth = labelProps.width + delta.width;
    const changedHeight = labelProps.height + delta.height;
    const positionX = position.x;
    const positionY = position.y;
    if (
      labelProps.width !== changedWidth ||
      labelProps.height !== changedHeight
    ) {
      setLabelProps({
        ...labelProps,
        width: changedWidth,
        height: changedHeight,
        positionX,
        positionY,
      });
      resizeMaterial(
        props.canvasId,
        Material.Labels,
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
    !labelProps.isLocked && isEdit ? (
      <textarea
        style={{
          fontSize: fontSize,
          width: labelProps.width,
          height: labelProps.height,
          resize: "none",
        }}
        value={labelProps.word}
        onChange={(e) => {
          // console.log(e.target.value);
          setLabelProps({ ...labelProps, word: e.target.value });
        }}
        autoFocus
        onFocus={(e) =>
          e.currentTarget.setSelectionRange(
            e.currentTarget.value.length,
            e.currentTarget.value.length
          )
        }
      />
    ) : (
      <div id={props.id}>
        <Textfit
          className={style}
          max={300}
          onReady={(e) => {
            setFontSize(e);
          }}
        >
          {labelProps.word}
        </Textfit>
      </div>
    );
  useEffect(() => {
    //編集状態を解除する
    if (props.isAreaClicked) {
      setIsEdit(false);
      if (props.word !== labelProps.word) {
        setLabelProps({ ...labelProps, word: labelProps.word });
        editMaterialWord(
          props.canvasId,
          Material.Labels,
          props.id,
          labelProps.word
        );
      }
    }
  }, [props.isAreaClicked]);

  useEffect(() => {
    // console.log(props);
    setLabelProps(props);
  }, [props]);

  return (
    <Rnd
      style={{ zIndex: props.zIndex }}
      size={{
        width: labelProps.width,
        height: labelProps.height,
      }}
      position={{ x: labelProps.positionX, y: labelProps.positionY }}
      onDragStop={handleStop}
      onResizeStop={handleResizeStop}
      minHeight="50"
      minWidth="50"
      onMouseOver={() => {
        if (!labelProps.isLocked && style !== classes.onHoverContainer) {
          setStyle(classes.onHoverContainer);
        }
      }}
      onMouseLeave={() => {
        if (!labelProps.isLocked && style !== classes.container) {
          setStyle(classes.container);
        }
      }}
      id={props.id}
      disableDragging={labelProps.isLocked}
      enableResizing={!labelProps.isLocked}
    >
      <div
        onDoubleClick={(e) => {
          setIsEdit(true);
          props.setIsAreaClicked(false);
        }}
        onContextMenu={handleClick}
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
            objName={Material.Labels}
            id={props.id}
            setProps={setLabelProps}
          />
          <MenuItem
            disabled={labelProps.isLocked}
            onClick={(e) => {
              setIsEdit(true);
              handleClose();
            }}
          >
            編集
          </MenuItem>
          <MenuItem
            disabled={labelProps.isLocked}
            onClick={() => {
              bringForward(
                props.canvasId,
                Material.Labels,
                props.id,
                props.zIndex
              );
            }}
          >
            前面へ
          </MenuItem>
          <MenuItem
            disabled={labelProps.isLocked}
            onClick={() => {
              bringToFront(props.canvasId, Material.Labels, props.id);
            }}
          >
            最前面へ
          </MenuItem>
          <MenuItem
            disabled={labelProps.isLocked}
            onClick={() => {
              sendBackward(
                props.canvasId,
                Material.Labels,
                props.id,
                props.zIndex
              );
            }}
          >
            背面へ
          </MenuItem>
          <MenuItem
            disabled={labelProps.isLocked}
            onClick={() => {
              sendToBack(props.canvasId, Material.Labels, props.id);
            }}
          >
            最背面へ
          </MenuItem>
          <MenuItem
            disabled={labelProps.isLocked}
            onClick={() => {
              deleteMaterial(props.canvasId, Material.Labels, props.id);
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
    padding: 0,
    zIndex: (props: LabelProps) => props.zIndex,
    whiteSpace: "pre-wrap",
  },
  onHoverContainer: {
    position: "absolute",
    boxSizing: "border-box",
    border: "1px solid gray",
    height: "100%",
    width: "100%",
    padding: 0,
    zIndex: (props: LabelProps) => props.zIndex,
    whiteSpace: "pre-wrap",
  },
});

export default Label;
