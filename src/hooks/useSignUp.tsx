import { useContext, useState, useCallback } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useSignUp = () => {
  const { signupWithEmailAndPassword } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailOnChanged = useCallback(
    (event) => {
      setEmail(event.target.value);
    },
    [setEmail]
  );

  const handleUserNameOnChanged = useCallback(
    (event) => {
      setUserName(event.target.value);
    },
    [setUserName]
  );

  const handlePasswordOnChanged = useCallback(
    (event) => {
      setPassword(event.target.value);
    },
    [setPassword]
  );
  const onSubmit = async (event) => {
    event.preventDefault();
    await signupWithEmailAndPassword(email, password, userName);
    setErrorMessage(
      "ユーザーを登録しました。登録に使用したメールアドレスの受信トレイをご確認ください"
    );
  };
  return [
    errorMessage,
    onSubmit,
    handleUserNameOnChanged,
    handleEmailOnChanged,
    handlePasswordOnChanged,
  ];
};
