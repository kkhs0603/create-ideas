// @ts-nocheck
import React, { useEffect, useMemo, useState, useContext } from "react";
import StickyNote from "../molecules/StickyNote";
import { makeStyles } from "@material-ui/core/styles";
import { MaterialsContext } from "../../contexts/MaterialsContext";
import {
  Menu,
  MenuItem,
  Divider,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import Line from "../molecules/Line";
import Label from "../molecules/Label";
import ImageBox from "../molecules/ImageBox";
import NestedMenuItem from "material-ui-nested-menu-item";
import html2canvas from "html2canvas";
import { useDropzone } from "react-dropzone";

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

const Material = {
  StickyNotes: "stickyNotes",
  Lines: "lines",
  Labels: "labels",
} as const;

type Material = typeof Material[keyof typeof Material];

const initialMouseState = {
  mouseX: null,
  mouseY: null,
};

const Canvas: React.FC<StickyNoteAreaProps> = (props: StickyNoteAreaProps) => {
  const {
    enterCanvas,
    stickyNotes,
    addMaterial,
    lines,
    isEdit,
    labels,
    addImageBox,
    imageBoxes,
    // uploadTemplate,
  } = useContext(MaterialsContext);
  const [mouseState, setMouseState] = useState<{
    mouseX: number;
    mouseY: number;
  }>(initialMouseState);
  const [isAreaClicked, setIsAreaClicked] = useState<boolean>(false);
  const [areaSize, setAreaSize] = useState({ width: 0, height: 0 });
  const classes = useStyles(areaSize);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    noClick: true,
    accept: "image/jpeg, image/png",
  });
  const [droppedPosition, setDroppedPosition] = useState({ x: 0, y: 0 });
  const [isOpendBackdrop, setIsOpendBackdrop] = useState<boolean>(false);

  useEffect(() => {
    enterCanvas(props.id);
    const canvasElement = document.getElementById("canvas");
    setAreaSize({
      width: canvasElement.clientWidth,
      height: canvasElement.scrollHeight,
    });
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    if (e.target.id !== "imageDropzone") return;
    setMouseState({
      mouseX: e.clientX,
      mouseY: e.clientY,
    });
    setIsAreaClicked(true);
  };

  const handleClose = () => {
    if (mouseState !== initialMouseState) {
      setMouseState(initialMouseState);
    }
  };
  //画像出力
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
    const target = document.getElementById("canvas");
    html2canvas(target, {
      useCORS: true,
    }).then((canvas) => {
      const targetImgUri = canvas.toDataURL("img/png");
      saveAsImage(targetImgUri);
    });
  };

  //画像入力/ImageBox
  const inputRef = React.useRef();
  const AddImageBoxWithRightClick = (e) => {
    inputRef.current.click();
  };

  const OnChangedImage = async (e) => {
    const image = e.target.files[0];
    if (image !== undefined) {
      // setIsOpendBackdrop(true);
      await addImageBox(props.id, droppedPosition.x, droppedPosition.y, image);
      // setIsOpendBackdrop(false);
    }
  };

  // useEffect(() => {
  //   console.log("stickyNotes", stickyNotes);
  // }, [stickyNotes]);
  const stickyNotesComponent = stickyNotes?.map((stickyNote) => {
    return (
      <StickyNote
        key={stickyNote.id}
        canvasId={props.id}
        isAreaClicked={isAreaClicked}
        setIsAreaClicked={setIsAreaClicked}
        isEdit={
          (isEdit(stickyNote.createdBy) && stickyNote.word === "") || false
        }
        {...stickyNote}
      />
    );
  });

  const linesComponent =
    lines === null ? (
      <div>line</div>
    ) : (
      lines?.map((line) => (
        <Line
          key={line.id}
          canvasId={props.id}
          areaSize={areaSize}
          setIsAreaClicked={setIsAreaClicked}
          {...line}
        />
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

  const imageBoxesComponent = imageBoxes?.map((imageBox) => (
    <ImageBox key={imageBox.id} canvasId={props.id} {...imageBox} />
  ));
  useEffect(() => {
    acceptedFiles.map((file) => {
      addImageBox(props.id, droppedPosition.x, droppedPosition.y, file);
      //storageにアップロード
    });
  }, [acceptedFiles]);

  return (
    <div id="canvas" className={classes.container}>
      {/* <Backdrop className={classes.backdrop} open={isOpendBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop> */}
      <div
        id="imageDropzone"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          outline: "none",
          zIndex: -1,
        }}
        {...getRootProps({
          className: "dropzone",
          onDrop: (event) => {
            const canvasElement = document.getElementById("canvas");
            const dropPositionY = event.clientY - canvasElement.offsetTop;
            const dropPositionX = event.clientX;
            setDroppedPosition({ x: dropPositionX, y: dropPositionY });
          },
        })}
        onContextMenu={handleClick}
        onClick={(e) => {
          e.preventDefault();
          if (e.target.id !== "imageDropzone") return;
          setMouseState({
            mouseX: e.clientX,
            mouseY: e.clientY,
          });
          setIsAreaClicked(true);
        }}
      >
        <input
          {...getInputProps()}
          style={{
            position: "absolute",
            visibility: "hidden",
            outline: "none",
            width: "100%",
            height: "100%",
          }}
        />
      </div>
      <input
        type="file"
        ref={inputRef}
        onChange={(e) => {
          OnChangedImage(e);
        }}
        style={{ display: "none" }}
        accept="image/png, image/jpeg, image/gif"
      />
      {stickyNotesComponent}
      {linesComponent}
      {labelsComponent}
      {imageBoxesComponent}
      <Menu
        keepMounted
        open={mouseState.mouseY !== null && mouseState.mouseY != null}
        onEntering={(e) => {
          setDroppedPosition({
            //ヘッダーの高さ分微調整
            x: e.offsetLeft,
            y: e.offsetTop - 85,
          });
        }}
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
                addMaterial(
                  props.id,
                  Material.StickyNotes,
                  mouseState.mouseX,
                  mouseState.mouseY,
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
                addMaterial(
                  props.id,
                  Material.StickyNotes,
                  mouseState.mouseX,
                  mouseState.mouseY,
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
                addMaterial(
                  props.id,
                  Material.StickyNotes,
                  mouseState.mouseX,
                  mouseState.mouseY,
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
                addMaterial(
                  props.id,
                  Material.StickyNotes,
                  mouseState.mouseX,
                  mouseState.mouseY,
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
              addMaterial(
                props.id,
                Material.Lines,
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
              addMaterial(
                props.id,
                Material.Lines,
                0,
                mouseState.mouseY,
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
              addMaterial(
                props.id,
                Material.Labels,
                mouseState.mouseX,
                mouseState.mouseY,
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
            onClick={(e) => {
              handleClose();
              AddImageBoxWithRightClick(e);
            }}
          >
            画像を貼る
          </MenuItem>
          <MenuItem
            onClick={(e) => {
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
const useStyles = makeStyles((theme) => ({
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
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export default Canvas;
