import React, { useState, createContext, useCallback, useEffect } from "react";
import firebase, { googleProvider } from "../firebase/firebase";
import ErrorMessage from "../firebase/ErrorMessage.js";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
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
    });
  }, [auth]);
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signinWithGoogle,
        signout,
        loading,
        signupWithEmailAndPassword,
        signinWithEmailAndPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
