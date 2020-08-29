import React from 'react';
import Style from './Label.module.scss';

const Label = (props) => {
  return <div className={Style.label}>{props.text}</div>;
};

export default Label;
