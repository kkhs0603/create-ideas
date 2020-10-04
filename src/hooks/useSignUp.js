import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useSignUp = () => {
  const { signupWithEmailAndPassword } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleEmailOnChanged = (event) => {
    setUserName(event.target.value);
  };
  const handleUserNameOnChanged = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordOnChanged = (event) => {
    setPassword(event.target.value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    const result = await signupWithEmailAndPassword(email, password, userName);
    setErrorMessage(result);
  };
  return [
    errorMessage,
    onSubmit,
    handleUserNameOnChanged,
    handleEmailOnChanged,
    handlePasswordOnChanged,
  ];
};
