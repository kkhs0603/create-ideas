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
      const userDoc = await db
        .collection("users")
        .doc(auth.currentUser.uid)
        .get();
      const userData = userDoc.data();
      console.log(userData);
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
        snapshot.docChanges().forEach((change) => {
          setCanvases((values) => [
            ...values,
            {
              id: change.doc.id,
              name: change.doc.data().name,
              created_by: change.doc.data().created_by,
              created_at: change.doc.data().created_at,
            },
          ]);
          // 追加
          if (change.type === "added") {
            // addLog(change.doc.id, change.doc.data());
          }
          // 更新
          else if (change.type === "modified") {
            // modLog(change.doc.id, change.doc.data());
          }
          // 削除
          else if (change.type === "removed") {
            // removeLog(change.doc.id);
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCanvasName = (event) => {
    console.log(event.target.value);
    setCanvasName(event.target.value);
  };

  const enterCanvas = async (canvasId) => {
    try {
      //firebase canvasesのコレクションから参加しているユーザーID取得
      const canvasesRef = await db.collection("canvases").doc(canvasId);
      const joinedUsers = (await canvasesRef.get()).data().joined_users;
      if (!joinedUsers.includes(auth.currentUser.uid)) {
        joinedUsers.push(auth.currentUser.uid);
        canvasesRef.update({ joined_users: joinedUsers });
      }
      //取得したユーザーIDからユーザー情報取得
      joinedUsers.map(async (user) => {
        const usersRef = db.collection("users").doc(user);
        const userdata = (await usersRef.get()).data();
        setJoinedUsers((user) => [...user, userdata]);
      });
      await canvasesRef.onSnapshot((snapshot) => {
        if (snapshot.data().created_by !== auth.currentUser.uid) {
          console.log("not authoer");
        } else {
          console.log("author");
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
