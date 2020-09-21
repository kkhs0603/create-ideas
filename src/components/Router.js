import React, { useContext } from "react";
import { AuthContext } from "../contexts/Auth";

export default ({ renderLoading, renderSignIn, renderMain }) => {
  const { currentUser, loading } = useContext(AuthContext);

  return (
    <>
      {loading
        ? renderLoading()
        : currentUser
        ? renderMain(currentUser)
        : renderSignIn()}
    </>
  );
};
