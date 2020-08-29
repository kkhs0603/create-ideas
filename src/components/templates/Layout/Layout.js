import React from 'react';
import Header from '../../organisms/Header/Header';
import Style from './Layout.module.scss';

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
