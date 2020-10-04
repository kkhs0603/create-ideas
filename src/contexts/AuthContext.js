import React, { useState, createContext, useEffect } from "react";
import firebase, { googleProvider } from "../firebase/firebase";
import ErrorMessage from "../firebase/ErrorMessage.js";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const auth = firebase.auth();

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
    } catch (error) {
      return ErrorMessage(error, "signup");
    }
  };

  const signinWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await auth.signInWithRedirect(googleProvider);
      return result;
    } catch (e) {
      return ErrorMessage(e, "signin");
    }
  };

  const signout = async () => {
    try {
      setLoading(true);
      await auth.signOut();
      console.log("sign out");
      setLoading(false);
    } catch (e) {
      return ErrorMessage(e, "signout");
    }
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setLoading(false);
      if (user == null) {
        setToken(null);
        setUser(null);
        localStorage.clear();
        return;
      }
      setUser(user);
      const token = user.getIdToken(true);
      setToken(token);
      localStorage.setItem("token", token);
    });
  }, [auth]);
  return (
    <AuthContext.Provider
      value={{
        signinWithGoogle,
        signout,
        loading,
        signupWithEmailAndPassword,
        signinWithEmailAndPassword,
        token,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
