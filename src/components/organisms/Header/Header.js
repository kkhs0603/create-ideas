import React, { useContext } from "react";
import Style from "./Header.module.scss";
import { AuthContext } from "../../../contexts/Auth";

const Header = () => {
  const { currentUser, signout } = useContext(AuthContext);
  console.log(currentUser);
  return (
    <div className={Style.header}>
      <span>Create Ideas</span>
      {currentUser != null ? (
        <div className={Style.profile}>
          <button onClick={signout}>
            <img alt="" src={currentUser.photoURL} />
          </button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Header;
