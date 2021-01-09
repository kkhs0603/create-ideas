import React, { useState, createContext, useEffect } from "react";
import firebase, { storage } from "../firebase/firebase";
import { useRouter } from "next/router";
import { DvrTwoTone } from "@material-ui/icons";
import html2canvas from "html2canvas";
import loadImage from "blueimp-load-image";

type Canvas = {
  //TODO:型直す
  createdAt: Date;
  createdBy: string;
  name: string;
  updatedAt: Date;
};

type StickyNote = {
  color: string;
  createdBy: string;
  id: string;
  positionX: number;
  positionY: number;
  word: string;
  zIndex: number;
  width: number;
  height: number;
};

type Line = {
  id: string;
  vh: string;
  positionX: number;
  positionY: number;
  zIndex: number;
};

type Label = {
  id: string;
  word: string;
  positionX: number;
  positionY: number;
  zIndex: number;
  width: number;
  height: number;
  createdBy: string;
};

const CanvasObject = {
  StickyNotes: "stickyNotes",
  Lines: "lines",
  Labels: "labels",
} as const;

type CanvasObject = typeof CanvasObject[keyof typeof CanvasObject];

type Template = {
  name: string;
  labels: Array<Label>;
  lines: Array<Line>;
  stickyNotes: Array<StickyNote>;
};

//interface
interface IContextProps {
  createCanvas: (canvasName: string, templateId: string) => void;
  canvases: Array<Canvas>;
  enterCanvas: (canvasId: string) => void;
  joinedUsers;
  getAllCanvasDatas: (canvasId: string) => void;
  stickyNotes: Array<StickyNote>;
  changeStickyNoteColor: (
    canvasId: string,
    stickyNoteId: string,
    color: string
  ) => void;
  lines: Array<Line>;

  bringForward: (
    canvasId: string,
    objName: string,
    id: string,
    zIndex: number
  ) => void;
  bringToFront: (canvasId: string, objName: string, id: string) => void;
  sendBackward: (
    canvasId: string,
    objName: string,
    id: string,
    zIndex: number
  ) => void;
  sendToBack: (canvasId: string, objName: string, id: string) => void;
  isEdit: (createdBy: string) => boolean;
  labels: Array<Label>;

  addCanvasObject: (
    id: string,
    objName: CanvasObject,
    positionX: number,
    positionY: number,
    option: string
  ) => void;
  deleteCanvasObject: (
    canvasId: string,
    objName: CanvasObject,
    objId: string
  ) => void;
  moveCanvasObject: (
    canvasId: string,
    objName: CanvasObject,
    objId: string,
    x: number,
    y: number
  ) => void;
  editCanvasObjectWord: (
    canvasId: string,
    objName: CanvasObject,
    objId: string,
    word: string
  ) => void;
  resizeCanvasObject: (
    canvasId: string,
    objName: CanvasObject,
    objId: string,
    positionX: number,
    positionY: number,
    width: number,
    height: number
  ) => void;
  lockCanvasObject: (
    canvasId: string,
    objName: CanvasObject,
    objId: string,
    isLocked: boolean
  ) => void;
}

const CanvasContext = createContext({} as IContextProps);
const db = firebase.firestore();
const CanvasProvider: React.FC = ({ children }) => {
  const [canvases, setCanvases] = useState<Array<Canvas>>([]);
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [stickyNotes, setStickyNotes] = useState<Array<StickyNote>>([]);
  const [lines, setLines] = useState<Array<Line>>([]);
  const [labels, setLabels] = useState<Array<Label>>([]);
  const [templates, setTemplates] = useState<Array<Template>>([]);
  const auth = firebase.auth();
  const router = useRouter();
  /* --------------------------
  Canvas
  -------------------------- */
  const createCanvas = async (canvasName: string, templateId: string) => {
    try {
      //canvases
      const result = await db.collection("canvases").add({
        name: canvasName,
        ideas: [],
        joinedUsers: [],
        createdAt: new Date().toLocaleString("ja"),
        createdBy: auth.currentUser.uid,
        updatedAt: new Date().toLocaleString("ja"),
      });

      const stickyNotesRef = await db
        .collection("templates")
        .doc(templateId)
        .collection(CanvasObject.StickyNotes)
        .get();
      const stickyNotes = stickyNotesRef.docs.map((stickyNote) =>
        stickyNote.data()
      );

      const linesRef = await db
        .collection("templates")
        .doc(templateId)
        .collection(CanvasObject.Lines)
        .get();
      const lines = linesRef.docs.map((line) => line.data());

      const labelsRef = await db
        .collection("templates")
        .doc(templateId)
        .collection(CanvasObject.Labels)
        .get();
      const labels = labelsRef.docs.map((label) => label.data());

      console.log("stickyNotes writing");
      await stickyNotes.forEach(async (stickyNote) => {
        const stickyResult = await result
          .collection(CanvasObject.StickyNotes)
          .add(stickyNote);
        result
          .collection(CanvasObject.StickyNotes)
          .doc(stickyResult.id)
          .update({ id: stickyResult.id });
      });
      console.log("labels writing");
      await labels.forEach(async (label) => {
        const labelResult = await result
          .collection(CanvasObject.Labels)
          .add(label);
        result
          .collection(CanvasObject.Labels)
          .doc(labelResult.id)
          .update({ id: labelResult.id });
      });
      console.log("lines writing");
      await lines.forEach(async (line) => {
        const lineResult = await result
          .collection(CanvasObject.Lines)
          .add(line);
        result
          .collection(CanvasObject.Lines)
          .doc(lineResult.id)
          .update({ id: lineResult.id });
      });

      console.log("new canvas created!");
      router.push("/Canvases/" + result.id);
    } catch (error) {
      console.log(error);
    }
  };

  const getCanvases = async () => {
    try {
      const canvasesRef = await db.collection("canvases");
      canvasesRef.onSnapshot((snapshot) => {
        snapshot.docs.forEach(async (change) => {
          const userRef = await db
            .collection("users")
            .doc(change.data().createdBy)
            .get();
          setCanvases((values) => [
            ...values,
            {
              id: change.id,
              name: change.data().name,
              createdBy: userRef.data().name,
              createdAt: change.data().createdAt,
              updatedAt: change.data().updatedAt,
            },
          ]);
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const enterCanvas = async (canvasId: string) => {
    try {
      console.log("enter canvas");
    } catch (error) {
      console.log(error.message);
    }
  };

  const getAllCanvasDatas = (canvasId: string) => {
    try {
      getCanvasObject(canvasId, CanvasObject.StickyNotes);
      getCanvasObject(canvasId, CanvasObject.Lines);
      getCanvasObject(canvasId, CanvasObject.Labels);
    } catch (error) {
      console.log(error.message);
    }
  };
  /* --------------------------
  canvasObject
  -------------------------- */
  const addCanvasObject = async (
    canvasId: string,
    objName: CanvasObject,
    positionX: number,
    positionY: number,
    option: string
  ) => {
    try {
      console.log("add", objName);
      const zIndeices = await getAllZindices(canvasId);
      const maxZindex =
        zIndeices.length !== 0 ? Math.max.apply(null, zIndeices) : 0;
      const ref = await db
        .collection("canvases")
        .doc(canvasId)
        .collection(objName);

      switch (objName) {
        case CanvasObject.StickyNotes:
          const StickyResult = await ref.add({
            word: "",
            positionX,
            positionY,
            width: 50,
            height: 50,
            createdBy: auth.currentUser.uid,
            color: option,
            zIndex: maxZindex + 1,
            isLocked: false,
          });
          ref.doc(StickyResult.id).update({ id: StickyResult.id });
          break;

        case CanvasObject.Lines:
          const lineResult = await ref.add({
            vh: option,
            positionX,
            positionY,
            isLocked: false,
          });
          ref
            .doc(lineResult.id)
            .update({ id: lineResult.id, zIndex: maxZindex + 1 });
          break;

        case CanvasObject.Labels:
          const labelResult = await ref.add({
            positionX,
            positionY,
            word: "",
            width: 100,
            height: 100,
            createdBy: auth.currentUser.uid,
            isLocked: false,
          });
          ref
            .doc(labelResult.id)
            .update({ id: labelResult.id, zIndex: maxZindex + 1 });
          break;
      }
      await updateCanvas(canvasId);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getCanvasObject = async (canvasId: string, objName: CanvasObject) => {
    try {
      console.log("get " + objName);
      const ref = await db
        .collection("canvases")
        .doc(canvasId)
        .collection(objName);

      //初回getで全部とる
      //変更があった場合、変更があったものだけ配列の中身をかえる
      ref.onSnapshot((snapshot) => {
        switch (objName) {
          case CanvasObject.StickyNotes:
            setStickyNotes([]);
            setStickyNotes(snapshot.docs.map((word) => word.data()));
            break;
          case CanvasObject.Lines:
            setLines([]);
            setLines(snapshot.docs.map((line) => line.data()));
            break;
          case CanvasObject.Labels:
            setLabels([]);
            setLabels(snapshot.docs.map((label) => label.data()));
            break;
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteCanvasObject = async (
    canvasId: string,
    objName: CanvasObject,
    objId: string
  ): Promise<void> => {
    try {
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection(objName)
        .doc(objId)
        .delete();
      await updateCanvas(canvasId);
    } catch (error) {
      console.log(error.message);
    }
  };

  const moveCanvasObject = async (
    canvasId: string,
    objName: CanvasObject,
    objId: string,
    x: number,
    y: number
  ): Promise<void> => {
    try {
      console.log("move ", objName);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection(objName)
        .doc(objId)
        .update({
          positionX: x,
          positionY: y,
        });
      await updateCanvas(canvasId);
    } catch (error) {
      console.log(error.message);
    }
  };

  const editCanvasObjectWord = async (
    canvasId: string,
    objName: CanvasObject,
    objId: string,
    word: string
  ) => {
    try {
      console.log("edit " + objName + " word");
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection(objName)
        .doc(objId)
        .update({
          word: word,
        });
      await updateCanvas(canvasId);
    } catch (error) {
      console.log(error.message);
    }
  };

  const resizeCanvasObject = async (
    canvasId: string,
    objName: CanvasObject,
    objId: string,
    positionX: number,
    positionY: number,
    width: number,
    height: number
  ) => {
    try {
      console.log("resize", objName);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection(objName)
        .doc(objId)
        .update({
          positionX,
          positionY,
          width,
          height,
        });
      await updateCanvas(canvasId);
    } catch (error) {
      console.log(error.message);
    }
  };

  const lockCanvasObject = async (
    canvasId: string,
    objName: CanvasObject,
    objId: string,
    isLocked: boolean
  ) => {
    try {
      console.log("lock " + objName);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection(objName)
        .doc(objId)
        .update({
          isLocked,
        });
      await updateCanvas(canvasId);
    } catch (error) {
      console.log(error.message);
    }
  };

  /* --------------------------
  stickyNote
  -------------------------- */
  const changeStickyNoteColor = async (
    canvasId: string,
    stickyNoteId: string,
    color: string
  ) => {
    try {
      console.log("change stickyNote color : " + color);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection("stickyNotes")
        .doc(stickyNoteId)
        .update({
          color: color,
        });
      await updateCanvas(canvasId);
    } catch (error) {
      console.log(error.message);
    }
  };

  const isEdit = (createdBy: string) => {
    return auth.currentUser.uid === createdBy;
  };

  const updateCanvasChangedTime = async (canvasId: string) => {
    try {
      await db
        .collection("canvases")
        .doc(canvasId)
        .update({ updatedAt: new Date().toLocaleString("ja") });
    } catch (error) {
      console.log(error.message);
    }
  };

  const updateCanvas = async (canvasId: string) => {
    updateCanvasChangedTime(canvasId);
    updateThumbnail(canvasId);
  };
  /* --------------------------
  toBack/toFront
  -------------------------- */

  //前面へ
  const bringForward = async (
    canvasId: string,
    objName: string,
    id: string,
    zIndex: number
  ) => {
    try {
      console.log("bringFoward : " + objName);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection(objName)
        .doc(id)
        .update({
          zIndex: zIndex + 1,
        });
      await updateCanvas(canvasId);
    } catch (error) {
      console.log(error.message);
    }
  };

  //最前面へ
  const bringToFront = async (
    canvasId: string,
    objName: string,
    id: string
  ) => {
    try {
      console.log("bringToFront : " + objName);
      const zIndeices = await getAllZindices(canvasId);
      console.log(zIndeices);
      const maxZindex = Math.max.apply(null, zIndeices);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection(objName)
        .doc(id)
        .update({
          zIndex: maxZindex + 1,
        });
      await updateCanvas(canvasId);
    } catch (error) {
      console.log(error.message);
    }
  };

  //背面へ
  const sendBackward = async (
    canvasId: string,
    objName: string,
    id: string,
    zIndex: number
  ) => {
    try {
      console.log("sendBackward : " + objName);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection(objName)
        .doc(id)
        .update({
          zIndex: zIndex - 1,
        });
      await updateCanvas(canvasId);
    } catch (error) {
      console.log(error.message);
    }
  };

  //最背面へ
  const sendToBack = async (canvasId: string, objName: string, id: string) => {
    try {
      console.log("sendToBack : " + objName);
      const zIndeices = await getAllZindices(canvasId);
      const maxZindex = Math.min.apply(null, zIndeices);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection(objName)
        .doc(id)
        .update({
          zIndex: maxZindex - 1,
        });
      await updateCanvas(canvasId);
    } catch (error) {
      console.log(error.message);
    }
  };

  //全オブジェクトのzIndex取得
  const getAllZindices = async (canvasId: string) => {
    const wordsRef = await db
      .collection("canvases")
      .doc(canvasId)
      .collection("stickyNotes");
    const words = await (await wordsRef.get()).docs;
    const zIndices = words.map((word) => word.data().zIndex);

    const linesRef = await db
      .collection("canvases")
      .doc(canvasId)
      .collection("lines");
    const lines = await (await linesRef.get()).docs;
    const linesZindices = lines.map((line) => line.data().zIndex);
    const result = zIndices.concat(linesZindices);
    console.log("zindex", result);
    return result;
  };

  /* --------------------------
  Line
  -------------------------- */

  /* --------------------------
  Label
  -------------------------- */

  /* --------------------------
  Template
  -------------------------- */
  const getTemplates = async () => {
    const ref = await db.collection("templates");
    const docs = await (await ref.get()).docs;
    const temps = await docs.map((doc) => doc.data());
    setTemplates(temps);
  };

  const uploadTemplate = async () => {
    const ref = await db.collection("templates");
    const result = await ref.add({ name: "PDCA" });

    stickyNotes.map((stickyNote) =>
      ref.doc(result.id).collection(CanvasObject.StickyNotes).add(stickyNote)
    );
    labels.map((label) =>
      ref.doc(result.id).collection(CanvasObject.Labels).add(label)
    );
    lines.map((line) =>
      ref.doc(result.id).collection(CanvasObject.Lines).add(line)
    );
  };

  const updateThumbnail = async (canvasId: string) => {
    try {
      console.log("update thumbnail");
      const target = document.getElementById("area");
      console.log(target);
      html2canvas(target).then(async (canvas) => {
        const dataUrl = canvas.toDataURL("image/png");
        const result = await loadImage(dataUrl, {
          maxWidth: 300,
          canvas: true,
        });
        result.image.toBlob(async (blob) => {
          firebase.storage().ref(`/images/thumbnails/${canvasId}`).put(blob);
        });
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const authState = auth.onAuthStateChanged((user) => {
      if (user) {
        getCanvases();
        getTemplates();
      }
    });
    return () => authState();
  }, []);

  return (
    <CanvasContext.Provider
      value={{
        createCanvas,
        canvases,
        enterCanvas,
        joinedUsers,

        addCanvasObject,
        deleteCanvasObject,
        moveCanvasObject,
        editCanvasObjectWord,
        resizeCanvasObject,
        lockCanvasObject,

        stickyNotes,
        changeStickyNoteColor,
        lines,
        bringForward,
        bringToFront,
        sendBackward,
        sendToBack,

        isEdit,
        getAllCanvasDatas,
        labels,

        uploadTemplate,
        templates,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export { CanvasContext, CanvasProvider };
