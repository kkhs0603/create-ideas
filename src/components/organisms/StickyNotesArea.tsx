import React, { useRef, useEffect, useMemo, useState, useContext } from "react";
import StickyNote from "./StickyNote";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "../../firebase/firebase";
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

const initiaMouselState = {
  mouseX: null,
  mouseY: null,
};

const StickyNotesArea: React.FC<StickyNoteAreaProps> = (
  props: StickyNoteAreaProps
) => {
  const ref = useRef(null);
  const classes = useStyles(props);
  const [stickyNotes, setStickyNotes] = useState<Array<StickyNote>>([]);
  const [mouseState, setMouseState] = useState<{
    mouseX: number;
    mouseY: number;
  }>(initiaMouselState);
  const { addLine, getAllLines, lines, addStickyNote, isEdit } = useContext(
    CanvasContext
  );
  const [isAreaClicked, setIsAreaClicked] = useState<boolean>(false);

  useEffect(() => {
    const wordsRef = firebase
      .firestore()
      .collection("canvases")
      .doc(props.id)
      .collection("stickyNotes");
    //wordsRef
    const unsubscribe = wordsRef.onSnapshot((snapshot) => {
      console.log("onsnap");
      setStickyNotes([]);
      setStickyNotes(snapshot.docs.map((word) => word.data()));
    });

    getAllLines(props.id);
    return () => unsubscribe();
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
                  addStickyNote(
                    props.id,
                    mouseState.mouseX - ref.current.getBoundingClientRect().x,
                    mouseState.mouseY - ref.current.getBoundingClientRect().y,
                    "yellow"
                  );
                  handleClose();
                  setIsAreaClicked(false);
                }}
              >
                黄
              </MenuItem>
              <MenuItem
                onClick={() => {
                  addStickyNote(
                    props.id,
                    mouseState.mouseX - ref.current.getBoundingClientRect().x,
                    mouseState.mouseY - ref.current.getBoundingClientRect().y,
                    "red"
                  );
                  handleClose();
                  setIsAreaClicked(false);
                }}
              >
                赤
              </MenuItem>
              <MenuItem
                onClick={() => {
                  addStickyNote(
                    props.id,
                    mouseState.mouseX - ref.current.getBoundingClientRect().x,
                    mouseState.mouseY - ref.current.getBoundingClientRect().y,
                    "blue"
                  );
                  handleClose();
                  setIsAreaClicked(false);
                }}
              >
                青
              </MenuItem>
              <MenuItem
                onClick={() => {
                  addStickyNote(
                    props.id,
                    mouseState.mouseX - ref.current.getBoundingClientRect().x,
                    mouseState.mouseY - ref.current.getBoundingClientRect().y,
                    "green"
                  );
                  handleClose();
                  setIsAreaClicked(false);
                }}
              >
                緑
              </MenuItem>
            </NestedMenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                addLine(
                  props.id,
                  "vertical",
                  mouseState.mouseX - ref.current.getBoundingClientRect().x,
                  0
                );
                handleClose();
              }}
            >
              縦線を引く
            </MenuItem>
            <MenuItem
              onClick={() => {
                addLine(
                  props.id,
                  "horizontal",
                  0,
                  mouseState.mouseY - ref.current.getBoundingClientRect().y
                );
                handleClose();
              }}
            >
              横線を引く
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
    width: "100%",
    height: "70vh",
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
});

export default StickyNotesArea;
