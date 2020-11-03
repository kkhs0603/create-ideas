import React, { useState, createContext, useEffect } from "react";
import firebase from "../firebase/firebase";
const CanvasContext = createContext();
const db = firebase.firestore();
const CanvasProvider = ({ children }) => {
  const [canvases, setCanvases] = useState([]);
  const [canvasName, setCanvasName] = useState("");
  const [joinedUsers, setJoinedUsers] = useState([]);
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
        joined_users: [],
        created_at: timestamp,
        created_by: auth.currentUser.uid,
        updated_at: timestamp,
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
          const date = change.data().created_at.toDate();
          setCanvases((values) => [
            ...values,
            {
              id: change.id,
              name: change.data().name,
              created_by: change.data().created_by,
              created_at: date,
            },
          ]);
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCanvasName = (event) => {
    //console.log(event.target.value);
    setCanvasName(event.target.value);
  };

  const enterCanvas = async (canvasId) => {
    try {
      //firebase canvasesのコレクションから参加しているユーザーID取得
      setJoinedUsers([]);
      const canvasesRef = await db.collection("canvases").doc(canvasId);
      const joinedUserIds = (await canvasesRef.get()).data().joined_users;
      const myUserId = auth.currentUser.uid;
      if (!joinedUserIds.includes(myUserId)) {
        joinedUserIds.push(myUserId);
        canvasesRef.update({ joined_users: joinedUserIds });
      }
      //取得したユーザーIDからユーザー情報取得
      joinedUserIds.map(async (userId) => {
        const usersRef = db.collection("users").doc(userId);
        const userdata = (await usersRef.get()).data();
        setJoinedUsers((user) => [...user, userdata]);
      });
      await canvasesRef.onSnapshot((snapshot) => {
        if (snapshot.data().created_by !== auth.currentUser.uid) {
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
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export { CanvasContext, CanvasProvider };
