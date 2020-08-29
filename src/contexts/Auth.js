import React, { useState, createContext, useCallback, useEffect } from "react";
import firebase, { googleProvider } from "../firebase";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const auth = firebase.auth();
  const signin = useCallback(async () => {
    try {
      setLoading(true);
      await auth.signInWithRedirect(googleProvider);
    } catch (e) {
      console.error(e.code, e.message);
    }
  }, [auth]);

  const signout = useCallback(async () => {
    try {
      setLoading(true);
      await auth.signOut();
      console.log("sign out");
    } catch (e) {
      console.error(e.code, e.message);
    }
  }, [auth]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setLoading(false);
      setCurrentUser(user);
    });
  }, [auth]);
  return (
    <AuthContext.Provider value={{ currentUser, signin, signout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
