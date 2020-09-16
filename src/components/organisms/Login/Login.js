import React, { useContext } from "react";
import { AuthContext } from "../../../contexts/Auth";
import { Separator } from "../../atoms/Separator/Separator";
import { useForm } from "react-hook-form";
import Style from "./Login.module.scss";

export const Login = () => {
  const { register, handleSubmit, watch, errors } = useForm();
  const { signin, singninWithMail } = useContext(AuthContext);
  const onSubmit = async (event) => {
    await singninWithMail(event.email, event.password);
  };
  return (
    <div className={Style.login}>
      <input type="button" className={Style.signinButton} onClick={signin} />
      <Separator />
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">メールアドレス</label>
        <br></br>
        {errors.email && <span>This field is required</span>}
        <input
          type="email"
          name="email"
          placeholder="メールアドレスを入力"
          ref={register({
            required: true,
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
            required: true,
          })}
          type="password"
        />
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
};
