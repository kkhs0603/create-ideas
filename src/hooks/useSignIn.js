import { useContext, useState, useCallback } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useSignIn = () => {
  const { signinWithGoogle, signinWithEmailAndPassword } = useContext(
    AuthContext
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailOnChanged = useCallback(
    (event) => {
      setEmail(event.target.value);
    },
    [setEmail]
  );

  const handlePasswordOnChanged = useCallback(
    (event) => {
      setPassword(event.target.value);
    },
    [setPassword]
  );
  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await signinWithEmailAndPassword(email, password);
    setErrorMessage(result);
  };
  return [
    errorMessage,
    signinWithGoogle,
    handleSubmit,
    handleEmailOnChanged,
    handlePasswordOnChanged,
  ];
};
