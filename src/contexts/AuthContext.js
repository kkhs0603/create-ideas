import React, { useState, createContext, useEffect } from "react";
import firebase, { googleProvider } from "../firebase/firebase";
import ErrorMessage from "../firebase/ErrorMessage.js";
import { useHistory } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const auth = firebase.auth();
  const history = useHistory();
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
      result.user.updateProfile({ displayName: userName });
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

  const userSetting = () => {
    history.push("/settings");
  };

  const updateUserSetting = async (name) => {
    try {
      await user.updateProfile({ displayName: name });
    } catch (error) {
      console.log(error);
    }
  };

  const goBack = () => {
    history.goBack();
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user == null) {
        setUser(null);
        localStorage.clear();
        return;
      }
      setUser(user);

      const usersCollection = firebase
        .firestore()
        .collection("users")
        .doc(user.uid);
      if (!usersCollection.get()) {
        const timestamp = firebase.firestore.Timestamp.now();
        usersCollection.set({
          id: user.uid,
          name: user.displayName,
          canvasIds: [],
          created_at: timestamp,
          updated_at: timestamp,
        });
      }
      history.push("/canvases");
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
        userSetting,
        updateUserSetting,
        goBack,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
