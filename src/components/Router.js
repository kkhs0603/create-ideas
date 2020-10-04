import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default ({
  renderLoading,
  renderSignIn,
  renderSelectCanvas,
  renderUserSettings,
}) => {
  const { token, loading, isUserSetting } = useContext(AuthContext);

  return (
    <>
      {loading
        ? renderLoading()
        : token
        ? isUserSetting
          ? renderUserSettings()
          : renderSelectCanvas()
        : renderSignIn()}
    </>
  );
};
