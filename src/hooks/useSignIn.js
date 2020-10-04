import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useSignIn = () => {
  const { signinWithGoogle, signinWithEmailAndPassword } = useContext(
    AuthContext
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleEmailOnChanged = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordOnChanged = (event) => {
    setPassword(event.target.value);
  };
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
