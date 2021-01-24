// @ts-nocheck
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
import NestedMenuItem from "material-ui-nested-menu-item";
import html2canvas from "html2canvas";

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

const initialMouseState = {
  mouseX: null,
  mouseY: null,
};

const StickyNotesArea: React.FC<StickyNoteAreaProps> = (
  props: StickyNoteAreaProps
) => {
  const ref = useRef();
  const [mouseState, setMouseState] = useState<{
    mouseX: number;
    mouseY: number;
  }>(initialMouseState);
  const {
    stickyNotes,
    addCanvasObject,
    lines,
    isEdit,
    labels,
    uploadTemplate,
  } = useContext(CanvasContext);
  const [isAreaClicked, setIsAreaClicked] = useState<boolean>(false);
  const [areaSize, setAreaSize] = useState({ width: 0, height: 0 });

  const classes = useStyles(areaSize);
  useEffect(() => {
    setAreaSize({
      width: ref.current.scrollWidth,
      height: ref.current.scrollHeight,
    });
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
    if (mouseState !== initialMouseState) {
      setMouseState(initialMouseState);
    }
  };
  const saveAsImage = (uri) => {
    const downloadLink = document.createElement("a");
    if (typeof downloadLink.download === "string") {
      downloadLink.href = uri;
      downloadLink.download = "idea.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      window.open(uri);
    }
  };

  const onClickExport = () => {
    const target = document.getElementById("area");
    html2canvas(target).then((canvas) => {
      const targetImgUri = canvas.toDataURL("img/png");
      saveAsImage(targetImgUri);
    });
  };

  const stickyNotesComponent = stickyNotes?.map((stickyNote) => (
    <StickyNote
      key={stickyNote.id}
      parent={ref.current?.getBoundingClientRect()}
      canvasId={props.id}
      isAreaClicked={isAreaClicked}
      setIsAreaClicked={setIsAreaClicked}
      isEdit={(isEdit(stickyNote.createdBy) && stickyNote.word === "") || false}
      {...stickyNote}
    />
  ));

  const linesComponent =
    lines === null ? (
      <div>line</div>
    ) : (
      lines?.map((line) => (
        <Line key={line.id} canvasId={props.id} areaSize={areaSize} {...line} />
      ))
    );

  const labelsComponent = labels?.map((label) => (
    <Label
      key={label.id}
      canvasId={props.id}
      isEdit={(isEdit(label.createdBy) && label.word === "") || false}
      setIsAreaClicked={setIsAreaClicked}
      isAreaClicked={isAreaClicked}
      {...label}
    />
  ));

  return (
    <div
      id="area"
      className={classes.container}
      ref={ref}
      onContextMenu={handleClick}
      onClick={(e) => {
        e.preventDefault();
        if (e.target.id !== "area") return;
        setIsAreaClicked(true);
      }}
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
          {/* <MenuItem onClick={zoomOut}>縮小</MenuItem>
            <MenuItem onClick={zoomIn}>拡大</MenuItem> */}
          <MenuItem
            onClick={() => {
              handleClose();
              onClickExport();
            }}
          >
            PNG出力
          </MenuItem>
          {/* <MenuItem
            onClick={() => {
              uploadTemplate();
              handleClose();
            }}
          >
            templateへ保存
          </MenuItem> */}
        </div>
      </Menu>
    </div>
  );
};
///////
//Style
///////
const useStyles = makeStyles({
  container: {
    height: "90vh",
    position: "relative",
    borderRadius: "5px",
    // height: "100%",
    // width: "auto",
    // width: "100vw",
    zIndex: 1,
    // backgroundColor: "gray",
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
