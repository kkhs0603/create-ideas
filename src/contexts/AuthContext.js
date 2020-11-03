import React, { useState, createContext, useEffect } from "react";
import firebase from "../firebase/firebase";
import ErrorMessage from "../firebase/ErrorMessage.js";
import { useRouter } from "next/router";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const auth = firebase.auth();
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
      const googleProvider = new firebase.auth.GoogleAuthProvider();
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
      await db
        .collection("users")
        .doc(userId)
        .update({ name: name, image_url: imageUrl });
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoUserSetting = () => {
    router.push("/UserSetting");
  };

  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user == null) {
        setUser(null);
        localStorage.clear();
        router.push("/");
        return;
      }
      setUser(user);
      const userRef = await db.collection("users").doc(user.uid);
      if (!userRef.get().exists) {
        const timestamp = firebase.firestore.Timestamp.now();
        await userRef.set({
          id: user.uid,
          name: user.displayName,
          imageUrl: user.photoURL,
          createdAt: timestamp,
          updatedAt: timestamp,
        });
      }
      router.push("/CanvasList");
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
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
