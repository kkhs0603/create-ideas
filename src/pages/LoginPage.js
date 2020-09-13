import React, { useState } from "react";
import Layout from "../components/templates/Layout/Layout";
import Title from "../components/atoms/Title/Title";
import TopSlider from "../components/molecules/TopSlider/TopSlider";
import { Login } from "../components/organisms/Login/Login";
import { SignUp } from "../components/organisms/SingnUp/SignUp";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const caption = isLogin ? "登録しますか？" : "ログインしますか？";
  return (
    <Layout>
      <Title />
      <TopSlider />
      {isLogin ? <Login /> : <SignUp />}
      <button
        style={{
          border: 0,
          backgroundColor: "transparent",
          cursor: "pointer",
          outline: "none",
          color: "blue",
        }}
        onClick={() => setIsLogin(!isLogin)}
      >
        {caption}
      </button>
    </Layout>
  );
};

export default LoginPage;
