import React from "react";
import Header from "../../organisms/Header/Header";
import Style from "./Layout.module.scss";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const Layout = ({ children }) => {
  return (
    <Container className={Style.wrapper}>
      <div className={Style.main}>
        <Header />
        {children}
      </div>
    </Container>
  );
};

export default Layout;
