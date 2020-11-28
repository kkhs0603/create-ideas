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
      });
      canvasRef.doc(result.id).update({ id: result.id });
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteWord = async (id) => {
    try {
      const canvasRef = await db
        .collection("canvases")
        .doc(canvasId)
        .collection("words");
      canvasRef.doc(id).delete();
    } catch (error) {
      console.log(error.message);
    }
  };

  const deletable = (userId) => {
    return auth.currentUser.uid === userId;
  };

  const moveStickyNote = async (canvasId, wordId, x, y) => {
    try {
      console.log("move stickyNote");
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

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log("auth");
      if (user) {
        getCanvases();
      }
    });
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
        deletable,
        moveStickyNote,
        getWords,
        words,
        changeStickyNoteColor,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export { CanvasContext, CanvasProvider };
