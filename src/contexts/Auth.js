import React, { useState, createContext, useCallback, useEffect } from "react";
import firebase, { googleProvider } from "../firebase/firebase";
import ErrorMessage from "../firebase/ErrorMessage.js";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [canvases, setCanvases] = useState([]);
  const auth = firebase.auth();

  ////////////
  //ユーザー権限
  ////////////
  const signupWithEmailAndPassword = async (email, password, userName) => {
    try {
      const result = await auth.createUserWithEmailAndPassword(email, password);
      result.user.updateProfile({ displayName: userName });
      const timestamp = firebase.firestore.Timestamp.now();
      firebase.firestore().collection("users").doc(result.user.uid).set({
        id: result.user.uid,
        name: userName,
        canvasIds: [],
        created_at: timestamp,
        updated_at: timestamp,
      });
      return result;
    } catch (e) {
      return ErrorMessage(e, "signup");
    }
  };

  const signinWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      await auth.signInWithRedirect(googleProvider);
    } catch (e) {
      return ErrorMessage(e, "signin");
    }
  }, [auth]);

  const signinWithEmailAndPassword = async (email, password) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (e) {
      return ErrorMessage(e, "signin");
    }
  };

  const signout = useCallback(async () => {
    try {
      setLoading(true);
      await auth.signOut();
      console.log("sign out");
    } catch (e) {
      return ErrorMessage(e, "signout");
    }
  }, [auth]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setLoading(false);
      setCurrentUser(user);
      getCanvases();
    });
  }, [auth]);

  /////////
  ///canvas
  /////////
  const newCanvas = async () => {
    try {
      let db = firebase.firestore();
      const userDoc = await db.collection("users").doc(currentUser.uid).get();
      const userData = userDoc.data();
      console.log(userData);
      if (userData.canvasIds !== null && userData.canvasIds.length >= 3) {
        console.log("canvasの上限です");
        return;
      }
      //canvases
      const timestamp = firebase.firestore.Timestamp.now();
      const docRef = await db.collection("canvases").add({
        words: [],
        ideas: [],
        users: [],
        created_at: timestamp,
        created_by: currentUser.uid,
        updated_at: timestamp,
      });
      //users
      await db
        .collection("users")
        .doc(currentUser.uid)
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
      let db = firebase.firestore();
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
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signinWithGoogle,
        signout,
        loading,
        signupWithEmailAndPassword,
        signinWithEmailAndPassword,
        newCanvas,
        canvases,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
