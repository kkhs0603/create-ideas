import React from 'react';
import Style from './Button.module.scss';

const Button = (props) => {
  const btnstyle = {
    backgroundColor: props.color,
    fontSize: '20px',
  };
  if (props.imgBtn) {
    return <input type="button" className={Style.imgbtn} onClick={props.onClick} />;
  } else {
    return (
      <input
        type="button"
        value={props.text}
        className={Style.btn}
        style={btnstyle}
        onClick={props.onClick}
      />
    );
  }
};

export default Button;
