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
};

type Line = {
  id: string;
  vh: string;
  positionX: number;
  positionY: number;
  zIndex: number;
};
//interface
interface IContextProps {
  createCanvas: (canvasName: string) => void;
  canvases: Array<Canvas>;
  enterCanvas: (canvasId: string) => void;
  joinedUsers;
  addStickyNote: (
    id: string,
    positionX: number,
    positionY: number,
    color: string
  ) => void;
  deleteStickyNote: (canvasId: string, stickyNoteId: string) => void;
  moveStickyNote: (
    canvasId: string,
    stickyNoteId: string,
    x: number,
    y: number
  ) => void;
  getAllStickyNote: (canvasId: string) => void;
  stickyNotes: Array<StickyNote>;
  changeStickyNoteColor: (
    canvasId: string,
    stickyNoteId: string,
    color: string
  ) => void;
  editStickyNoteWord: (
    canvasId: string,
    stickyNoteId: string,
    word: string
  ) => void;
  resizeStickyNote: (
    canvasId: string,
    stickyNoteId: string,
    positionX: number,
    positionY: number,
    width: number,
    height: number
  ) => void;
  getAllLines: (canvasId: string) => void;
  lines: Array<Line>;
  addLine: (canvasId: string, vh: string, x: number, y: number) => void;
  moveLine: (canvasId: string, lineId: string, x: number, y: number) => void;
  deleteLine: (canvasId: string, lineId: string) => void;
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
}

const CanvasContext = createContext({} as IContextProps);
const db = firebase.firestore();
const CanvasProvider: React.FC = ({ children }) => {
  const [canvases, setCanvases] = useState<Array<Canvas>>([]);
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [stickyNotes, setStickyNotes] = useState<Array<StickyNote>>([]);
  const [lines, setLines] = useState([]);
  const auth = firebase.auth();

  /////////
  ///canvas
  /////////
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

  // const handleCanvasName = (event) => {
  //   setCanvasName(event.target.value);
  // };

  const enterCanvas = async (canvasId: string) => {
    try {
      console.log("enter canvas");
      //TODO:修正
      //firebase canvasesのコレクションから参加しているユーザーID取得
      //update→setcanvasではなく
      //setCanvasしてupdate
      //ローカルのデータを書き換えてから、firebaseのデータを書き換える。
      // setJoinedUsers([]);
      //const canvasesRef = await db.collection("canvases").doc(canvasId);
      // await canvasesRef.onSnapshot((snapshot) => {
      //   setCanvasData(snapshot.data());
      // });
      // const joinedUserIds = canvasData.joinedUsers;
      // const myUserId = auth.currentUser.uid;
      // if (!joinedUserIds.includes(myUserId)) {
      //   joinedUserIds.push(myUserId);
      //   canvasesRef.update({ joinedUsers: joinedUserIds });
      // }
      // //取得したユーザーIDからユーザー情報取得
      // joinedUserIds.map(async (userId) => {
      //   const usersRef = db.collection("users").doc(userId);
      //   const userdata = (await usersRef.get()).data();
      //   setJoinedUsers((user) => [...user, userdata]);
      // });
      //words
      getAllStickyNote(canvasId);
    } catch (error) {
      console.log(error.message);
    }
  };

  /* --------------------------
  stickyNote
  -------------------------- */
  const getAllStickyNote = async (canvasId: string) => {
    console.log("getwords");
    const wordsRef = await db
      .collection("canvases")
      .doc(canvasId)
      .collection("stickyNotes");
    //wordsRef
    wordsRef.onSnapshot((snapshot) => {
      setStickyNotes([]);
      setStickyNotes(snapshot.docs.map((word) => word.data()));
    });
  };

  const addStickyNote = async (
    id: string,
    positionX: number,
    positionY: number,
    color: string
  ) => {
    try {
      const zIndeices = await getAllZindices(id);
      const maxZindex = Math.max.apply(null, zIndeices);
      const canvasRef = await db
        .collection("canvases")
        .doc(id)
        .collection("stickyNotes");
      const result = await canvasRef.add({
        word: "",
        positionX: positionX,
        positionY: positionY,
        width: 50,
        height: 50,
        createdBy: auth.currentUser.uid,
        color: color,
        zIndex: maxZindex + 1,
      });
      canvasRef.doc(result.id).update({ id: result.id });
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteStickyNote = async (
    canvasId: string,
    wordId: string
  ): Promise<void> => {
    try {
      const canvasRef = await db
        .collection("canvases")
        .doc(canvasId)
        .collection("stickyNotes");
      canvasRef.doc(wordId).delete();
    } catch (error) {
      console.log(error.message);
    }
  };

  const moveStickyNote = async (
    canvasId: string,
    stickyNoteId: string,
    x: number,
    y: number
  ) => {
    try {
      console.log("move stickyNote: ", stickyNoteId);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection("stickyNotes")
        .doc(stickyNoteId)
        .update({
          positionX: x,
          positionY: y,
        });
    } catch (error) {
      console.log(error.message);
    }
  };

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

  const editStickyNoteWord = async (
    canvasId: string,
    stickyNoteId: string,
    word: string
  ) => {
    try {
      console.log("editStickyNoteWord : " + word);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection("stickyNotes")
        .doc(stickyNoteId)
        .update({
          word: word,
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  const resizeStickyNote = (
    canvasId: string,
    stickyNoteId: string,
    positionX: number,
    positionY: number,
    width: number,
    height: number
  ) => {
    try {
      console.log("resize StickyNote");
      db.collection("canvases")
        .doc(canvasId)
        .collection("stickyNotes")
        .doc(stickyNoteId)
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
  const addLine = async (
    canvasId: string,
    vh: string,
    x: number,
    y: number
  ): Promise<void> => {
    try {
      console.log("add Line : " + vh + " x: " + x + " y: " + y);
      const zIndeices = await getAllZindices(canvasId);
      const maxZindex = Math.max.apply(null, zIndeices);
      const lineRef = db
        .collection("canvases")
        .doc(canvasId)
        .collection("lines");
      const result = await lineRef.add({ vh, positionX: x, positionY: y });
      lineRef.doc(result.id).update({ id: result.id, zIndex: maxZindex + 1 });
    } catch (error) {
      console.log(error.message);
    }
  };

  const getAllLines = async (canvasId: string) => {
    try {
      const lineRef = db
        .collection("canvases")
        .doc(canvasId)
        .collection("lines");
      lineRef.onSnapshot((snapshot) => {
        setLines([]);
        setLines(snapshot.docs.map((line) => line.data()));
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const moveLine = async (
    canvasId: string,
    lineId: string,
    x: number,
    y: number
  ) => {
    try {
      console.log("move line");
      const lineRef = db
        .collection("canvases")
        .doc(canvasId)
        .collection("lines")
        .doc(lineId);
      await lineRef.update({ positionX: x, positionY: y });
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteLine = async (canvasId: string, lineId: string) => {
    try {
      console.log("delete line");
      db.collection("canvases")
        .doc(canvasId)
        .collection("lines")
        .doc(lineId)
        .delete();
    } catch (error) {
      console.log(error.message);
    }
  };

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
        addStickyNote,
        deleteStickyNote,
        moveStickyNote,
        getAllStickyNote,
        stickyNotes,
        changeStickyNoteColor,
        editStickyNoteWord,
        resizeStickyNote,
        addLine,
        getAllLines,
        lines,
        moveLine,
        deleteLine,
        bringForward,
        bringToFront,
        sendBackward,
        sendToBack,
        isEdit,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export { CanvasContext, CanvasProvider };
