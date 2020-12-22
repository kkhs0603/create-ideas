import React, { useRef, useEffect, useMemo, useState, useContext } from "react";
import StickyNote from "./StickyNote";
import { makeStyles } from "@material-ui/core/styles";
import { CanvasContext } from "../../contexts/CanvasContext";
import {
  Button,
  TextField,
  Menu,
  MenuItem,
  Radio,
  Divider,
} from "@material-ui/core";
import Line from "../atoms/Line";
import Label from "../atoms/Label";
import Image from "next/image";
import NestedMenuItem from "material-ui-nested-menu-item";

type StickyNoteAreaProps = {
  id: string;
};

type StickyNote = {
  color: string;
  createdBy: string;
  id: string;
  positionX: number;
  positionY: number;
  word: string;
  zIndex: number;
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

const StickyNotesArea: React.FC<StickyNoteAreaProps> = (
  props: StickyNoteAreaProps
) => {
  const ref = useRef(null);
  const classes = useStyles(props);
  const [mouseState, setMouseState] = useState<{
    mouseX: number;
    mouseY: number;
  }>(initiaMouselState);
  const {
    getAllCanvasDatas,
    stickyNotes,
    addCanvasObject,
    lines,
    isEdit,
    labels,
  } = useContext(CanvasContext);
  const [isAreaClicked, setIsAreaClicked] = useState<boolean>(false);

  useEffect(() => {
    getAllCanvasDatas(props.id);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    if (e.target.id !== "area") return;
    setMouseState({
      mouseX: e.clientX - 2,
      mouseY: e.clientY - 4,
    });
    setIsAreaClicked(true);
  };

  const handleClose = () => {
    setMouseState(initiaMouselState);
  };

  const stickyNotesComponent = stickyNotes?.map((data, index) => (
    <StickyNote
      data={data}
      key={index}
      parent={ref.current?.getBoundingClientRect()}
      canvasId={props.id}
      isAreaClicked={isAreaClicked}
      setIsAreaClicked={setIsAreaClicked}
      isEdit={(isEdit(data.createdBy) && data.word === "") || false}
    />
  ));

  const linesComponent =
    lines === null ? (
      <div>line</div>
    ) : (
      lines?.map((line, index) => (
        <Line
          key={index}
          canvasId={props.id}
          id={line.id}
          vh={line.vh}
          x={line.positionX}
          y={line.positionY}
          zIndex={line.zIndex}
        ></Line>
      ))
    );

  const labelsComponent = labels?.map((label, index) => (
    <Label
      key={index}
      canvasId={props.id}
      id={label.id}
      positionX={label.positionX}
      positionY={label.positionY}
      width={label.width}
      height={label.height}
      zIndex={label.zIndex}
      word={label.word}
      isEdit={(isEdit(label.createdBy) && label.word === "") || false}
      setIsAreaClicked={setIsAreaClicked}
      isAreaClicked={isAreaClicked}
      createdBy={label.createdBy}
    />
  ));

  return (
    <div ref={ref} className={classes.frame}>
      {/* <Image src={"/swot.png"} alt="swot" layout="fill" unsized /> */}
      <div
        id="area"
        className={classes.container}
        onClick={(e) => {
          e.preventDefault();
          if (e.target.id !== "area") return;
          setIsAreaClicked(true);
        }}
        onContextMenu={handleClick}
      >
        {stickyNotesComponent}
        {linesComponent}
        {labelsComponent}
        <Menu
          keepMounted
          open={mouseState.mouseY !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            mouseState.mouseY !== null && mouseState.mouseX !== null
              ? { top: mouseState.mouseY, left: mouseState.mouseX }
              : undefined
          }
        >
          <div style={{ paddingTop: 10 }}>
            <NestedMenuItem label="新規付箋" parentMenuOpen={!!mouseState}>
              <MenuItem
                onClick={() => {
                  addCanvasObject(
                    props.id,
                    CanvasObject.StickyNotes,
                    mouseState.mouseX - ref.current.getBoundingClientRect().x,
                    mouseState.mouseY - ref.current.getBoundingClientRect().y,
                    "yellow"
                  );
                  handleClose();
                  setIsAreaClicked(false);
                }}
              >
                <div className={classes.stickyNoteYellow}>黄色</div>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  addCanvasObject(
                    props.id,
                    CanvasObject.StickyNotes,
                    mouseState.mouseX - ref.current.getBoundingClientRect().x,
                    mouseState.mouseY - ref.current.getBoundingClientRect().y,
                    "red"
                  );
                  handleClose();
                  setIsAreaClicked(false);
                }}
              >
                <div className={classes.stickyNoteRed}>赤色</div>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  addCanvasObject(
                    props.id,
                    CanvasObject.StickyNotes,
                    mouseState.mouseX - ref.current.getBoundingClientRect().x,
                    mouseState.mouseY - ref.current.getBoundingClientRect().y,
                    "blue"
                  );
                  handleClose();
                  setIsAreaClicked(false);
                }}
              >
                <div className={classes.stickyNoteBlue}>青色</div>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  addCanvasObject(
                    props.id,
                    CanvasObject.StickyNotes,
                    mouseState.mouseX - ref.current.getBoundingClientRect().x,
                    mouseState.mouseY - ref.current.getBoundingClientRect().y,
                    "green"
                  );
                  handleClose();
                  setIsAreaClicked(false);
                }}
              >
                <div className={classes.stickyNoteGreen}>緑色</div>
              </MenuItem>
            </NestedMenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                addCanvasObject(
                  props.id,
                  CanvasObject.Lines,
                  mouseState.mouseX - ref.current.getBoundingClientRect().x,
                  0,
                  "vertical"
                );
                handleClose();
              }}
            >
              縦線を引く
              <div className={classes.menuIconContainer}>
                <div className={classes.lineVertical}></div>
              </div>
            </MenuItem>
            <MenuItem
              onClick={() => {
                addCanvasObject(
                  props.id,
                  CanvasObject.Lines,
                  0,
                  mouseState.mouseY - ref.current.getBoundingClientRect().y,
                  "horizontal"
                );
                handleClose();
              }}
            >
              横線を引く
              <div className={classes.menuIconContainer}>
                <div className={classes.lineHorizonral}></div>
              </div>
            </MenuItem>
            <MenuItem
              onClick={() => {
                addCanvasObject(
                  props.id,
                  CanvasObject.Labels,
                  mouseState.mouseX - ref.current.getBoundingClientRect().x,
                  mouseState.mouseY - ref.current.getBoundingClientRect().y,
                  ""
                );
                handleClose();
                setIsAreaClicked(false);
              }}
            >
              新規ラベル
              <div className={classes.menuIconContainer}>
                <div style={{ fontSize: 12, paddingLeft: 3 }}>A</div>
              </div>
            </MenuItem>
          </div>
        </Menu>
      </div>
    </div>
  );
};
///////
//Style
///////
const useStyles = makeStyles({
  frame: {
    //margin: 10,
    height: "80vh",
    backgroundColor: "white",
    position: "relative",
    borderRadius: "5px",
    border: "10px solid #adb2bd",
    boxShadow: "inset -1px 2px 2px #404040, 6px 9px 1px rgba(0, 0, 0, 0.2)",
    overflow: "scroll",
    zIndex: 1,
  },
  container: {
    position: "relative",
    height: "100%",
    width: "100%",
    zIndex: 1,
  },
  stickyNoteYellow: {
    border: "1px solid black",
    backgroundColor: "#FFFCB3",
    padding: 3,
  },
  stickyNoteRed: {
    border: "1px solid black",
    backgroundColor: "#F6C0AF",
    padding: 3,
  },
  stickyNoteBlue: {
    border: "1px solid black",
    backgroundColor: "#AEDCF4",
    padding: 3,
  },
  stickyNoteGreen: {
    border: "1px solid black",
    backgroundColor: "#CDFDB3",
    padding: 3,
  },

  lineVertical: {
    width: 15,
    height: 15,
    marginLeft: 5,
    borderLeft: "4px solid black",
  },
  lineHorizonral: {
    width: 15,
    height: 15,
    marginTop: 5,
    borderTop: "4px solid black",
  },
  menuIconContainer: {
    marginLeft: 3,
    border: "1px solid black",
    height: 15,
    width: 15,
  },
});

export default StickyNotesArea;
