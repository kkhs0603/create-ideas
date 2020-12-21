import React from "react";
import Header from "../../organisms/Header";
import Style from "./Layout.module.scss";
import { Container } from "@material-ui/core";

const Layout = ({ children }) => {
  return (
    <div className={Style.wrapper}>
      <div className={Style.main}>
        <Header />
        {children}
      </div>
    </div>
  );
};

export default Layout;
