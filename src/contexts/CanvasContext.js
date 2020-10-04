import React, { useState, createContext, useEffect } from "react";
import firebase from "../firebase/firebase";
const CanvasContext = createContext();
const db = firebase.firestore();
const CanvasProvider = ({ children }) => {
  const [canvases, setCanvases] = useState([]);
  const [canvasName, setCanvasName] = useState("");
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
      if (userData.canvasIds !== null && userData.canvasIds.length >= 3) {
        console.log("canvasの上限です");
        return;
      }
      //canvases
      const timestamp = firebase.firestore.Timestamp.now();
      const docRef = await db.collection("canvases").add({
        name: canvasName,
        words: [],
        ideas: [],
        joinedUsers: [],
        created_at: timestamp,
        created_by: auth.currentUser.uid,
        updated_at: timestamp,
      });
      //users
      await db
        .collection("users")
        .doc(auth.currentUser.uid)
        .update({
          canvasIds: firebase.firestore.FieldValue.arrayUnion(docRef.id),
        });
      console.log("new canvas created!");
    } catch (error) {
      console.log(error);
    }
  };

  const getCanvases = async () => {
    try {
      const canvasesRef = db.collection("canvases");
      const canvases = await canvasesRef.get();
      let arr = [];
      await canvases.forEach((canvas) => arr.push(canvas.data()));
      console.log(arr);
      setCanvases(arr);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCanvasName = (event) => {
    console.log(event.target.value);
    setCanvasName(event.target.value);
  };

  useEffect(() => {
    auth.onAuthStateChanged(() => {
      getCanvases();
    });
  }, [auth]);

  return (
    <CanvasContext.Provider
      value={{
        createCanvas,
        canvases,
        handleCanvasName,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export { CanvasContext, CanvasProvider };
