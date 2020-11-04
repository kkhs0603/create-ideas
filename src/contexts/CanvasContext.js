import React, { useState, createContext, useEffect } from "react";
import firebase from "../firebase/firebase";
const CanvasContext = createContext();
const db = firebase.firestore();
const CanvasProvider = ({ children }) => {
  const [canvases, setCanvases] = useState([]);
  const [canvasName, setCanvasName] = useState("");
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [canvasData, setCanvasData] = useState();
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
      //firebase canvasesのコレクションから参加しているユーザーID取得
      setJoinedUsers([]);
      const canvasesRef = await db.collection("canvases").doc(canvasId);
      const data = (await canvasesRef.get()).data();
      setCanvasData(data);
      const joinedUserIds = data.joinedUsers;
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
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export { CanvasContext, CanvasProvider };
