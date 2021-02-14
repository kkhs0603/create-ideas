import React, { useState, useContext, useEffect } from "react";
import { MaterialsContext } from "../../contexts/MaterialsContext";
import { TextField, Menu, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Rnd } from "react-rnd";
import { Textfit } from "react-textfit";
import LockButton from "../atoms/LockButton";
import FrontBackContextMenuItems from "../atoms/FrontBackContextMenuItems";
import { MaterialType } from "../../MaterialTypeEnum";
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
  color: string;
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
  } = useContext(MaterialsContext);
  const [style, setStyle] = useState(classes.container);
  const [isEdit, setIsEdit] = useState<boolean>(props.isEdit);
  const [mouseState, setMouseState] = useState<mouseState>(initiaMouselState);
  const [fontSize, setFontSize] = useState<number>(30);
  const [labelProps, setLabelProps] = useState<LabelProps>({
    positionX: props.positionX,
    positionY: props.positionY,
    width: props.width,
    height: props.height,
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
        MaterialType.Labels,
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
        MaterialType.Labels,
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
          min={30}
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
          MaterialType.Labels,
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
            objName={MaterialType.Labels}
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
          <FrontBackContextMenuItems
            materialType={MaterialType.Labels}
            canvasId={props.canvasId}
            {...labelProps}
          />
          <MenuItem
            disabled={labelProps.isLocked}
            onClick={() => {
              deleteMaterial(props.canvasId, MaterialType.Labels, props.id);
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
