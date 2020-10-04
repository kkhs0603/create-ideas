import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default ({
  renderLoading,
  renderSignIn,
  renderMain,
  renderSelectCanvas,
}) => {
  const { token, loading } = useContext(AuthContext);

  return (
    <>
      {loading
        ? renderLoading()
        : token
        ? renderSelectCanvas()
        : /* ? renderMain(currentUser) */
          renderSignIn()}
    </>
  );
};
