import React, { useState, useEffect } from "react";
import firebase, { User } from "../firebase/firebase";
import ErrorMessage from "../firebase/ErrorMessage";
import { useRouter } from "next/router";

const AuthContext = React.createContext({});

const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const auth = firebase.auth();
  const db = firebase.firestore();
  //TODO:reducerを通してstateを変更するように
  const signinWithEmailAndPassword = async (email, password) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(error);
      return ErrorMessage(error, "signin");
    }
  };

  const signupWithEmailAndPassword = async (email, password, userName) => {
    try {
      const result = await auth.createUserWithEmailAndPassword(email, password);
      if (!auth.currentUser?.emailVerified) {
        auth.currentUser?.sendEmailVerification();
        return ErrorMessage({ code: "auth/email-verifying" }, "signup");
      }

      return result;
    } catch (error) {
      console.log(error);
      return ErrorMessage(error, "signup");
    }
  };

  const signinWithGoogle = async () => {
    try {
      setIsLoading(true);
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
        .update({
          name: name,
          image_url: imageUrl,
          updatedAt: new Date().toLocaleString("ja"),
        });
    } catch (error) {
      console.log(error);
    }
  };

  const toUserSettingPage = () => {
    router.push("/UserSetting");
  };

  const toCanvasPage = () => {
    router.push("/CanvasList");
  };

  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      console.log("user", user);
      if (!user?.emailVerified || user == null) {
        setUser(null);
        router.push({ pathname: "/" });
        return;
      }
      setUser(user);
      const userRef = await db.collection("users").doc(user.uid);
      if (!userRef.get().exists) {
        await userRef.set({
          id: user.uid,
          name: user.displayName,
          imageUrl: user.photoURL,
          createdAt: new Date().toLocaleString("ja"),
          updatedAt: new Date().toLocaleString("ja"),
        });
      }
      router.push("/CanvasList");
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signinWithGoogle,
        signout,
        signupWithEmailAndPassword,
        signinWithEmailAndPassword,
        user,
        toCanvasPage,
        toUserSettingPage,
        handleGoBack,
        updateUser,
        router,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
