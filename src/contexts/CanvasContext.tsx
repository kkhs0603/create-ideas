// @ts-nocheck
import React, { useState, createContext, useEffect, useReducer } from "react";
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
  id: string;
  imageUrl: string;
  description: string;
};

//interface
interface IContextProps {
  createCanvas: (canvasName: string, templateId: string) => void;
  canvases: Array<Canvas>;
  enterCanvas: (canvasId: string) => void;
  joinedUsers;
  getAllCanvasObjects: (canvasId: string) => void;
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
  templates: Array<Template>;
  user: any;
}

const CanvasContext = createContext({} as IContextProps);
const db = firebase.firestore();
const CanvasProvider: React.FC = ({ children }) => {
  const [canvases, setCanvases] = useState<Array<Canvas>>([]);
  const [canvasData, setCanvasData] = useState<Canvas>();

  const ObjReducer = (
    objArray: Array<StickyNote> | Array<Line> | Array<Label>,
    action: {
      type: "added" | "modified" | "removed" | "initialize";
      obj: StickyNote | Line | Label;
    }
  ) => {
    if (!objArray) return [];
    switch (action.type) {
      case "added":
        // console.log(objArray, action.obj);
        if (objArray.length === 0) {
          return [action.obj];
        }
        return [...objArray, action.obj];
      case "modified":
        if (!objArray) break;
        const modifyArray = objArray;
        const modifyIndex = modifyArray.findIndex(
          (obj) => obj.id === action.obj.id
        );
        if (modifyIndex < 0) break;
        modifyArray[modifyIndex] = action.obj;
        return modifyArray;
      case "removed":
        if (!objArray) break;
        const removeArray = objArray;
        const removeIndex = removeArray.findIndex(
          (obj) => obj.id === action.obj.id
        );
        if (removeIndex < 0) break;
        return removeArray.filter((obj) => obj.id !== action.obj.id);
      case "initialize":
        return [];
    }
  };

  const dispatchObject = (
    objName: string,
    type: string,
    obj: StickyNote | Line | Label | null
  ) => {
    if (!obj) return;
    switch (objName) {
      case CanvasObject.StickyNotes:
        // console.log("add stickynote");
        dispatchStickyNotes({ type: type, obj: obj });
        break;
      case CanvasObject.Lines:
        // console.log("add line");
        dispatchLines({ type: type, obj: obj });
        break;
      case CanvasObject.Labels:
        // console.log("add label");
        dispatchLabels({ type: type, obj: obj });
        break;
    }
  };
  const [stickyNotes, dispatchStickyNotes] = useReducer(ObjReducer, []);
  const [lines, dispatchLines] = useReducer(ObjReducer, []);
  const [labels, dispatchLabels] = useReducer(ObjReducer, []);
  const [templates, setTemplates] = useState<Array<Template>>([]);
  const auth = firebase.auth();
  const router = useRouter();
  /* --------------------------
  Canvas
  -------------------------- */
  const createCanvas = async (canvasName: string, templateId: string) => {
    try {
      //canvases
      const templateRef = await db
        .collection("templates")
        .doc(templateId)
        .get();
      const result = await db.collection("canvases").add({
        name: canvasName,
        ideas: [],
        joinedUsers: [],
        createdAt:
          new Date().toLocaleString("ja") + ":" + new Date().getMilliseconds(),
        createdBy: auth.currentUser.uid,
        updatedAt:
          new Date().toLocaleString("ja") + ":" + new Date().getMilliseconds(),
      });

      await db.collection("canvases").doc(result.id).update({
        id: result.id,
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

      // console.log("stickyNotes writing");
      await stickyNotes.forEach(async (stickyNote) => {
        const stickyResult = await result
          .collection(CanvasObject.StickyNotes)
          .add(stickyNote);
        result
          .collection(CanvasObject.StickyNotes)
          .doc(stickyResult.id)
          .update({
            id: stickyResult.id,
            updatedBy: auth.currentUser.uid,
            updatedAt:
              new Date().toLocaleString("ja") +
              ":" +
              new Date().getMilliseconds(),
          });
      });
      // console.log("labels writing");
      await labels.forEach(async (label) => {
        const labelResult = await result
          .collection(CanvasObject.Labels)
          .add(label);
        result
          .collection(CanvasObject.Labels)
          .doc(labelResult.id)
          .update({
            id: labelResult.id,
            updatedBy: auth.currentUser.uid,
            updatedAt:
              new Date().toLocaleString("ja") +
              ":" +
              new Date().getMilliseconds(),
          });
      });
      // console.log("lines writing");
      await lines.forEach(async (line) => {
        const lineResult = await result
          .collection(CanvasObject.Lines)
          .add(line);
        result
          .collection(CanvasObject.Lines)
          .doc(lineResult.id)
          .update({
            id: lineResult.id,
            updatedBy: auth.currentUser.uid,
            updatedAt:
              new Date().toLocaleString("ja") +
              ":" +
              new Date().getMilliseconds(),
          });
      });

      // console.log("new canvas created!");
      router.push("/Canvases/" + result.id);
    } catch (error) {
      console.log(error);
    }
  };

  const getCanvases = async () => {
    try {
      setCanvases([]);
      const canvasesRef = await db.collection("canvases");
      canvasesRef.onSnapshot((snapshot) => {
        setCanvases([]);
        setCanvases(snapshot.docs.map((canvas) => canvas.data()));
      });
    } catch (error) {
      console.log(error);
    }
  };

  const enterCanvas = async (canvasId: string) => {
    try {
      // console.log("enter");
      dispatchObject(CanvasObject.StickyNotes, "initialize", []);
      dispatchObject(CanvasObject.Lines, "initialize", []);
      dispatchObject(CanvasObject.Labels, "initialize", []);
      setCanvasData();
      const canvasRef = await db.collection("canvases").doc(canvasId);
      const result = await canvasRef.get();
      setCanvasData(result.data());
      getAllCanvasObjects(canvasId);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getAllCanvasObjects = async (canvasId: string) => {
    try {
      await getCanvasObject(canvasId, CanvasObject.StickyNotes);
      await getCanvasObject(canvasId, CanvasObject.Lines);
      await getCanvasObject(canvasId, CanvasObject.Labels);
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
      // console.log("add", objName);
      const zIndeices = await getAllZindices(canvasId);
      const maxZindex =
        zIndeices.length !== 0 ? Math.max.apply(null, zIndeices) : 0;
      const ref = await db
        .collection("canvases")
        .doc(canvasId)
        .collection(objName)
        .doc();

      switch (objName) {
        case CanvasObject.StickyNotes:
          await ref.set({
            word: "",
            positionX,
            positionY,
            width: 50,
            height: 50,
            createdBy: auth.currentUser.uid,
            color: option,
            zIndex: maxZindex + 1,
            isLocked: false,
            id: ref.id,
            updatedBy: auth.currentUser.uid,
            updatedAt:
              new Date().toLocaleString("ja") +
              ":" +
              new Date().getMilliseconds(),
          });
          break;

        case CanvasObject.Lines:
          await ref.set({
            vh: option,
            positionX,
            positionY,
            isLocked: false,
            id: ref.id,
            zIndex: maxZindex + 1,
            updatedBy: auth.currentUser.uid,
            updatedAt:
              new Date().toLocaleString("ja") +
              ":" +
              new Date().getMilliseconds(),
          });
          break;

        case CanvasObject.Labels:
          await ref.set({
            positionX,
            positionY,
            word: "",
            width: 100,
            height: 100,
            createdBy: auth.currentUser.uid,
            isLocked: false,
            id: ref.id,
            zIndex: maxZindex + 1,
            updatedBy: auth.currentUser.uid,
            updatedAt:
              new Date().toLocaleString("ja") +
              ":" +
              new Date().getMilliseconds(),
          });
          break;
      }
      await updateCanvas(canvasId);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getCanvasObject = async (canvasId: string, objName: CanvasObject) => {
    try {
      // console.log("get " + objName);
      const ref = await db
        .collection("canvases")
        .doc(canvasId)
        .collection(objName);
      return ref.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          dispatchObject(objName, change.type, change.doc.data());
        });
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
      // console.log("delete ", objName);
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
      // console.log("move ", objName);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection(objName)
        .doc(objId)
        .update({
          positionX: x,
          positionY: y,
          updatedBy: auth.currentUser.uid,
          updatedAt:
            new Date().toLocaleString("ja") +
            ":" +
            new Date().getMilliseconds(),
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
      // console.log("edit " + objName + " word");
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection(objName)
        .doc(objId)
        .update({
          word: word,
          updatedBy: auth.currentUser.uid,
          updatedAt:
            new Date().toLocaleString("ja") +
            ":" +
            new Date().getMilliseconds(),
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
      // console.log("resize", objName);
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
          updatedBy: auth.currentUser.uid,
          updatedAt:
            new Date().toLocaleString("ja") +
            ":" +
            new Date().getMilliseconds(),
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
      // console.log("lock " + objName);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection(objName)
        .doc(objId)
        .update({
          isLocked,
          updatedBy: auth.currentUser.uid,
          updatedAt:
            new Date().toLocaleString("ja") +
            ":" +
            new Date().getMilliseconds(),
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
      // console.log("change stickyNote color : " + color);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection("stickyNotes")
        .doc(stickyNoteId)
        .update({
          color: color,
          updatedBy: auth.currentUser.uid,
          updatedAt:
            new Date().toLocaleString("ja") +
            ":" +
            new Date().getMilliseconds(),
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
        .update({
          updatedAt:
            new Date().toLocaleString("ja") +
            ":" +
            new Date().getMilliseconds(),
        });
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
      // console.log("bringFoward : " + objName);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection(objName)
        .doc(id)
        .update({
          zIndex: zIndex + 1,
          updatedBy: auth.currentUser.uid,
          updatedAt:
            new Date().toLocaleString("ja") +
            ":" +
            new Date().getMilliseconds(),
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
      // console.log("bringToFront : " + objName);
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
          updatedBy: auth.currentUser.uid,
          updatedAt:
            new Date().toLocaleString("ja") +
            ":" +
            new Date().getMilliseconds(),
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
      // console.log("sendBackward : " + objName);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection(objName)
        .doc(id)
        .update({
          zIndex: zIndex - 1,
          updatedBy: auth.currentUser.uid,
          updatedAt:
            new Date().toLocaleString("ja") +
            ":" +
            new Date().getMilliseconds(),
        });
      await updateCanvas(canvasId);
    } catch (error) {
      console.log(error.message);
    }
  };

  //最背面へ
  const sendToBack = async (canvasId: string, objName: string, id: string) => {
    try {
      // console.log("sendToBack : " + objName);
      const zIndeices = await getAllZindices(canvasId);
      const maxZindex = Math.min.apply(null, zIndeices);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection(objName)
        .doc(id)
        .update({
          zIndex: maxZindex - 1,
          updatedBy: auth.currentUser.uid,
          updatedAt:
            new Date().toLocaleString("ja") +
            ":" +
            new Date().getMilliseconds(),
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
    return result;
  };

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
      const target = document.getElementById("area");
      const canvas = await html2canvas(target);
      const dataUrl = canvas.toDataURL("image/png");
      const result = await loadImage(dataUrl, {
        maxWidth: 300,
        canvas: true,
      });
      result.image.toBlob(async (blob: Blob) => {
        const storageResult = await firebase
          .storage()
          .ref(`/images/thumbnails/${canvasId}`)
          .put(blob);
        //Canvasにサムネイル画像のURLがなければ入れる
        const url = await storageResult.ref.getDownloadURL();
        const canvasRef = await db.collection("canvases").doc(canvasId);
        const result = await canvasRef.get();
        if (!result.data().thumbnailUrl) {
          canvasRef.update({ thumbnailUrl: url });
        }
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
        getAllCanvasObjects,
        labels,

        uploadTemplate,
        templates,
        canvasData,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export { CanvasContext, CanvasProvider };
