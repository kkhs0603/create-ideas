import React, { useState, createContext, useEffect } from "react";
import firebase, { googleProvider } from "../firebase/firebase";
import ErrorMessage from "../firebase/ErrorMessage.js";
import { useHistory } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const auth = firebase.auth();
  const history = useHistory();
  const db = firebase.firestore();
  //TODO:reducerを通してstateを変更するように
  const signinWithEmailAndPassword = async (email, password) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      return ErrorMessage(error, "signin");
    }
  };

  const signupWithEmailAndPassword = async (email, password, userName) => {
    try {
      const result = await auth.createUserWithEmailAndPassword(email, password);
      await result.user.updateProfile({ displayName: userName });
      return result;
    } catch (error) {
      return ErrorMessage(error, "signup");
    }
  };

  const signinWithGoogle = async () => {
    try {
      await auth.signInWithRedirect(googleProvider);
    } catch (e) {
      return ErrorMessage(e, "signin");
    }
  };

  const signout = async () => {
    try {
      await auth.signOut();
      console.log("sign out");
    } catch (e) {
      return ErrorMessage(e, "signout");
    }
  };

  const updateUser = async (userId, name, imageUrl) => {
    try {
      // console.log(userId);
      await db
        .collection("users")
        .doc(userId)
        .update({ name: name, image_url: imageUrl });
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoUserSetting = () => {
    history.push("/settings");
  };

  const handleGoBack = () => {
    history.goBack();
  };

  const handleGoCanvas = (id) => {
    history.push({ pathname: "/canvas", state: { canvasId: id } });
  };

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user == null) {
        setUser(null);
        localStorage.clear();
        return;
      }
      setUser(user);
      const userRef = await db.collection("users").doc(user.uid);
      if (!userRef.get().exists) {
        const timestamp = firebase.firestore.Timestamp.now();
        await userRef.set({
          name: user.displayName,
          image_url: user.photoURL,
          created_at: timestamp,
          updated_at: timestamp,
        });
      }
      history.push("/canvas-list");
    });
  }, [auth]);
  return (
    <AuthContext.Provider
      value={{
        signinWithGoogle,
        signout,
        signupWithEmailAndPassword,
        signinWithEmailAndPassword,
        user,
        handleGoUserSetting,
        handleGoBack,
        handleGoCanvas,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
