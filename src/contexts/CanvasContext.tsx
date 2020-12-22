import React, { useState, createContext, useEffect } from "react";
import firebase from "../firebase/firebase";

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
  width: string;
  height: string;
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
  width: string;
  height: string;
  createdBy: string;
};

const CanvasObject = {
  StickyNotes: "stickyNotes",
  Lines: "lines",
  Labels: "labels",
} as const;

type CanvasObject = typeof CanvasObject[keyof typeof CanvasObject];

//interface
interface IContextProps {
  createCanvas: (canvasName: string) => void;
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
    width: string,
    height: string
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
  const auth = firebase.auth();

  /* --------------------------
  Canvas
  -------------------------- */
  const createCanvas = async (canvasName: string) => {
    try {
      //canvases
      const timestamp = firebase.firestore.Timestamp.now();
      await db.collection("canvases").add({
        name: canvasName,
        ideas: [],
        joinedUsers: [],
        createdAt: timestamp,
        createdBy: auth.currentUser.uid,
        updatedAt: timestamp,
      });
      console.log("new canvas created!");
    } catch (error) {
      console.log(error);
    }
  };

  const getCanvases = async () => {
    try {
      const canvasesRef = await db.collection("canvases");
      canvasesRef.onSnapshot((snapshot) => {
        snapshot.docs.forEach((change) => {
          const date = change.data().createdAt.toDate();
          setCanvases((values) => [
            ...values,
            {
              id: change.id,
              name: change.data().name,
              createdBy: change.data().createdBy,
              createdAt: date,
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
    id: string,
    objName: CanvasObject,
    positionX: number,
    positionY: number,
    option: string
  ) => {
    try {
      console.log("add", objName);
      const zIndeices = await getAllZindices(id);
      const maxZindex = Math.max.apply(null, zIndeices);
      const ref = await db.collection("canvases").doc(id).collection(objName);

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
          });
          ref.doc(StickyResult.id).update({ id: StickyResult.id });
          break;

        case CanvasObject.Lines:
          const lineResult = await ref.add({
            vh: option,
            positionX,
            positionY,
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
            width: "100px",
            height: "100px",
            createdBy: auth.currentUser.uid,
          });
          ref
            .doc(labelResult.id)
            .update({ id: labelResult.id, zIndex: maxZindex + 1 });
          break;
      }
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
    } catch (error) {
      console.log(error.message);
    }
  };

  const resizeCanvasObject = (
    canvasId: string,
    objName: CanvasObject,
    objId: string,
    positionX: number,
    positionY: number,
    width: string,
    height: string
  ) => {
    try {
      console.log("resize", objName);
      db.collection("canvases")
        .doc(canvasId)
        .collection(objName)
        .doc(objId)
        .update({
          positionX,
          positionY,
          width,
          height,
        });
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
    } catch (error) {
      console.log(error.message);
    }
  };

  const isEdit = (createdBy: string) => {
    return auth.currentUser.uid === createdBy;
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
    console.log(result);
    return result;
  };

  /* --------------------------
  Line
  -------------------------- */

  /* --------------------------
  Label
  -------------------------- */

  useEffect(() => {
    const authState = auth.onAuthStateChanged((user) => {
      console.log("auth");
      if (user) {
        getCanvases();
      }
    });
    return () => authState();
  }, [auth]);

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
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export { CanvasContext, CanvasProvider };
