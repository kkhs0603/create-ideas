import React, { useContext } from 'react';
import Style from './Header.module.scss';
import { AuthContext } from '../../../contexts/Auth';

const Header = () => {
  const { currentUser, signout } = useContext(AuthContext);
  return (
    <div className={Style.header}>
      <span>Create Ideas</span>
      {currentUser != null ? (
        <div className={Style.profile}>
          <button onClick={signout}>
            <img alt="prof" src={currentUser.photoURL} />
          </button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Header;
