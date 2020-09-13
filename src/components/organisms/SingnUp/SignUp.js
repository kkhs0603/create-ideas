import React, { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/Auth";
import Style from "./SignUp.module.scss";
import { useForm } from "react-hook-form";

export const SignUp = () => {
  const { register, handleSubmit, watch, errors } = useForm();
  const { signup } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");
  const onSubmit = async (event) => {
    const result = await signup(event.email, event.password, event.userName);
    console.log(result.message);
    setErrorMessage(result.message);
  };
  return (
    <div className={Style.signup}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="userName">ユーザー名</label>
        <br></br>
        {errors.userName && <span>This field is required</span>}
        <input
          id="userName"
          name="userName"
          placeholder="ユーザー名を入力"
          ref={register({
            required: "required",
          })}
          type="userName"
        />
        <label htmlFor="email">メールアドレス</label>
        <br></br>
        {errors.email && <span>This field is required</span>}
        <input
          type="email"
          name="email"
          placeholder="メールアドレスを入力"
          ref={register({
            required: "required",
            // pattern: {
            //   value: /S+@S+.S+/,
            // },
          })}
        />
        <label htmlFor="password">パスワード</label>
        <br></br>
        {errors.password && <span>This field is required</span>}
        <input
          id="password"
          name="password"
          placeholder="パスワードを入力"
          ref={register({
            required: "required",
          })}
          type="password"
        />
        {errorMessage ?? <span>{errorMessage}</span>}
        <button type="submit">登録</button>
      </form>
    </div>
  );
};
