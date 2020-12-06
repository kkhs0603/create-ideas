import React, { useState, createContext, useEffect } from "react";
import { useCollection } from "react-firebase-hooks/firestore";

import firebase from "../firebase/firebase";

const CanvasContext = createContext();
const db = firebase.firestore();
const CanvasProvider = ({ children }) => {
  const [canvases, setCanvases] = useState([]);
  const [canvasName, setCanvasName] = useState("");
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [canvasData, setCanvasData] = useState();
  const [canvasId, setCanvasId] = useState();
  const [words, setWords] = useState([]);
  const [lines, setLines] = useState([]);
  const auth = firebase.auth();

  /////////
  ///canvas
  /////////
  const createCanvas = async () => {
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

  const handleCanvasName = (event) => {
    setCanvasName(event.target.value);
  };

  const enterCanvas = async (canvasId) => {
    try {
      console.log("enter canvas");
      setCanvasId(canvasId);
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
      getWords(canvasId);
    } catch (error) {
      console.log(error.message);
    }
  };

  /* --------------------------
  stickyNote
  -------------------------- */
  const getWords = async (canvasId) => {
    console.log("getwords");
    const wordsRef = await db
      .collection("canvases")
      .doc(canvasId)
      .collection("words");
    //wordsRef
    wordsRef.onSnapshot((snapshot) => {
      setWords([]);
      setWords(snapshot.docs.map((word) => word.data()));
    });
  };

  const sendWord = async (id, word) => {
    try {
      const zIndeices = await getAllZindices(id);
      const maxZindex = Math.max.apply(null, zIndeices);
      const canvasRef = await db
        .collection("canvases")
        .doc(id)
        .collection("words");
      const result = await canvasRef.add({
        word: word,
        positionX: 0,
        positionY: 0,
        createdBy: auth.currentUser.uid,
        color: "yellow",
        zIndex: maxZindex + 1,
      });
      canvasRef.doc(result.id).update({ id: result.id });
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteWord = async (canvasId, wordId) => {
    try {
      const canvasRef = await db
        .collection("canvases")
        .doc(canvasId)
        .collection("words");
      canvasRef.doc(wordId).delete();
    } catch (error) {
      console.log(error.message);
    }
  };

  const moveStickyNote = async (canvasId, wordId, x, y) => {
    try {
      console.log("move stickyNote: ", wordId);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection("words")
        .doc(wordId)
        .update({
          positionX: x,
          positionY: y,
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  const changeStickyNoteColor = async (canvasId, wordId, color) => {
    try {
      console.log("change stickyNote color : " + color);
      await db
        .collection("canvases")
        .doc(canvasId)
        .collection("words")
        .doc(wordId)
        .update({
          color: color,
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  //前面へ
  const bringForward = async (canvasId, objName, id, zIndex) => {
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
  const bringToFront = async (canvasId, objName, id) => {
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
  const sendBackward = async (canvasId, objName, id, zIndex) => {
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
  const sendToBack = async (canvasId, objName, id) => {
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
  const getAllZindices = async (canvasId) => {
    const wordsRef = await db
      .collection("canvases")
      .doc(canvasId)
      .collection("words");
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
  const drawLine = async (canvasId, vh, x, y) => {
    try {
      console.log("draw Line : " + vh + " x: " + x + " y: " + y);
      const zIndeices = await getAllZindices(canvasId);
      const maxZindex = Math.max.apply(null, zIndeices);
      const lineRef = db
        .collection("canvases")
        .doc(canvasId)
        .collection("lines");
      const result = await lineRef.add({ vh, x, y });
      lineRef.doc(result.id).update({ id: result.id, zIndex: maxZindex + 1 });
    } catch (error) {
      console.log(error.message);
    }
  };

  const getLines = async (canvasId) => {
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

  const moveLine = async (canvasId, lineId, x, y) => {
    try {
      console.log("move line");
      const lineRef = db
        .collection("canvases")
        .doc(canvasId)
        .collection("lines")
        .doc(lineId);
      await lineRef.update({ x: x, y: y });
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteLine = async (canvasId, lineId) => {
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
        handleCanvasName,
        enterCanvas,
        joinedUsers,
        canvasData,
        sendWord,
        deleteWord,
        moveStickyNote,
        getWords,
        words,
        changeStickyNoteColor,
        drawLine,
        getLines,
        lines,
        moveLine,
        deleteLine,
        bringForward,
        bringToFront,
        sendBackward,
        sendToBack,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export { CanvasContext, CanvasProvider };
