import React, { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { Redirect } from "react-router-dom";

const AuthRouter = (props) => {
  const { user } = useContext(AuthContext);
  console.log("user", user);
  if (user) {
    return props.children;
  } else {
    return <Redirect to="/" />;
  }
};

export default AuthRouter;
