import React, { useState, createContext, useCallback, useEffect } from "react";
import firebase, { googleProvider } from "../firebase/firebase";
import ErrorMessage from "../firebase/ErrorMessage.js";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const auth = firebase.auth();

  const signupWithEmailAndPassword = async (email, password, userName) => {
    try {
      const result = await auth.createUserWithEmailAndPassword(email, password);
      result.user.updateProfile({ displayName: userName });
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
