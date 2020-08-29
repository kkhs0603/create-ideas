import React from "react";
import Style from "./SelectRandomWords.module.scss";
import Label from "../../atoms/Label/Label";
import InputNumber from "../../atoms/InputNumber/InputNumber";
import { FormControlLabel, Switch, withStyles } from "@material-ui/core";
import { green } from "@material-ui/core/colors";

const SelectRandomWords = (props) => {
  const GreenSwitch = withStyles({
    switchBase: {
      color: green[300],
      "&$checked": {
        color: green[500],
      },
      "&$checked + $track": {
        backgroundColor: green[500],
      },
    },
    checked: {},
    track: {},
  })(Switch);

  const swichChange = () => {
    console.log("switch changed");
    props.enableRandomWords(props.enable);
  };
  return (
    <div className={Style.selectRandomWords}>
      <div className={Style.label}>
        <Label text="Random Words?" />
      </div>
      <div className={Style.numeric}>
        <InputNumber
          enable={props.enable}
          type="random"
          increment={props.changeRandomWordsCount.increment}
          decrement={props.changeRandomWordsCount.decrement}
          onChange={props.changeRandomWordsCount.onChange}
          count={props.count}
        />
      </div>
      <div className={Style.switch}>
        <FormControlLabel
          control={
            <GreenSwitch checked={props.enable} onChange={swichChange} />
          }
        />
      </div>
    </div>
  );
};

export default SelectRandomWords;
