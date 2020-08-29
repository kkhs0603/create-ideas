import React, { useContext } from "react";
import { AuthContext } from "../contexts/Auth";

export default ({ renderLoading, renderLogin, renderMain }) => {
  const { currentUser, loading } = useContext(AuthContext);

  return (
    <>
      {loading ? renderLoading() : currentUser ? renderMain() : renderLogin()}
    </>
  );
};
