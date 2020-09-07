import React from "react";
import Style from "./AddWords.module.scss";
import Label from "../../atoms/Label/Label";
import Button from "../../atoms/Button/Button";

const AddWords = (props) => {
  return (
    <div className={Style.addWords}>
      <div className={Style.label}>
        <Label text="Add Words" />
      </div>
      <input
        type="text"
        onChange={(e) => {
          props.setWord(e.target.value);
        }}
        value={props.word}
      />
      {props.validationMessage && (
        <span className={Style.errorMessage}>{props.validationMessage}</span>
      )}
      <Button text="Add" color="#FFC895" onClick={props.write} />
    </div>
  );
};

export default AddWords;
