import React, { useState, createContext, useEffect } from "react";
import firebase from "../firebase/firebase";

const CanvasContext = createContext();
const db = firebase.firestore();
const CanvasProvider = ({ children }) => {
  const [canvases, setCanvases] = useState([]);
  const [canvasName, setCanvasName] = useState("");
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [canvasData, setCanvasData] = useState();
  const [canvasId, setCanvasId] = useState();
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
        words: [],
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
      setCanvasId(canvasId);
      //firebase canvasesのコレクションから参加しているユーザーID取得
      setJoinedUsers([]);
      const canvasesRef = await db.collection("canvases").doc(canvasId);
      await canvasesRef.onSnapshot((snapshot) => {
        setCanvasData(snapshot.data());
      });
      const joinedUserIds = canvasData.joinedUsers;
      const myUserId = auth.currentUser.uid;
      if (!joinedUserIds.includes(myUserId)) {
        joinedUserIds.push(myUserId);
        canvasesRef.update({ joinedUsers: joinedUserIds });
      }
      //取得したユーザーIDからユーザー情報取得
      joinedUserIds.map(async (userId) => {
        const usersRef = db.collection("users").doc(userId);
        const userdata = (await usersRef.get()).data();
        setJoinedUsers((user) => [...user, userdata]);
      });
      await canvasesRef.onSnapshot((snapshot) => {
        if (snapshot.data().createdBy !== auth.currentUser.uid) {
          // console.log("not authoer");
        } else {
          // console.log("author");
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const sendWord = async (word) => {
    try {
      console.log(word);
      const canvasRef = await db.collection("canvases").doc(canvasId);
      const words = (await canvasRef.get()).data().words;
      words.push({
        id: words.length,
        word: word,
        createdBy: auth.currentUser.uid,
      });
      canvasRef.update({ words: words });
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteWord = async (id) => {
    try {
      console.log("id", id);
      const canvasRef = await db.collection("canvases").doc(canvasId);
      const words = (await canvasRef.get()).data().words;
      const removedWords = words.filter((word) => word.id !== id);
      canvasRef.update({ words: removedWords });
    } catch (error) {
      console.log(error.message);
    }
  };

  const deletable = (userId) => {
    return auth.currentUser.uid === userId;
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
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
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export { CanvasContext, CanvasProvider };
