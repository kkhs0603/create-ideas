import React, { useContext } from 'react';
import Style from './SelectRandomWords.module.scss';
import Label from '../../atoms/Label/Label';
import InputNumber from '../../atoms/InputNumber/InputNumber';
import { FormControlLabel, Switch, withStyles } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { Store } from '../../../store/index';

const SelectRandomWords = (props) => {
  const { globalState, setGlobalState } = useContext(Store);
  const GreenSwitch = withStyles({
    switchBase: {
      color: green[300],
      '&$checked': {
        color: green[500],
      },
      '&$checked + $track': {
        backgroundColor: green[500],
      },
    },
    checked: {},
    track: {},
  })(Switch);

  const swichChange = () => {
    console.log('switch changed');
    if (globalState.enableRandomWords) {
      console.log('disable');
      setGlobalState({ type: 'SET_ENABLE_RANDOM_WORDS', payload: { enableRandomWords: false } });
    } else {
      console.log('enable');
      setGlobalState({ type: 'SET_ENABLE_RANDOM_WORDS', payload: { enableRandomWords: true } });
    }
  };
  return (
    <div className={Style.selectRandomWords}>
      <div className={Style.label}>
        <Label text="Random Words?" />
      </div>
      <div className={Style.numeric}>
        <InputNumber
          enable={globalState.enableRandomWords}
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
            <GreenSwitch
              checked={globalState.enableRandomWords}
              onChange={swichChange}
              name="checkedA"
            />
          }
        />
      </div>
    </div>
  );
};

export default SelectRandomWords;
