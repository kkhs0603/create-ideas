import { useContext, useState, useCallback } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useUserSetting = () => {
  const { updateUserSetting, user, goBack } = useContext(AuthContext);
  const [username, setUserName] = useState(user.displayName);
  const handleUserNameOnChanged = useCallback(
    (event) => {
      setUserName(event.target.value);
    },
    [setUserName]
  );
  const handleUpdateUserSetting = () => {
    updateUserSetting(username);
    goBack();
  };

  return [handleUpdateUserSetting, handleUserNameOnChanged, username, goBack];
};
