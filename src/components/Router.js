import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default ({
  renderLoading,
  renderSignIn,
  renderMain,
  renderSelectCanvas,
}) => {
  const { currentUser, loading } = useContext(AuthContext);

  return (
    <>
      {loading
        ? renderLoading()
        : currentUser
        ? renderSelectCanvas()
        : /* ? renderMain(currentUser) */
          renderSignIn()}
    </>
  );
};
