import React from 'react';
import Style from './CreateIdea.module.scss';
import Label from '../../atoms/Label/Label';
import Button from '../../atoms/Button/Button';
import InputNumber from '../../atoms/InputNumber/InputNumber';

const CreateIdea = (props) => {
  return (
    <div className={Style.createIdea}>
      <div className={Style.label}>
        <Label text="How many words?" />
      </div>
      <div className={Style.numeric}>
        <InputNumber
          enable={true}
          type="create"
          increment={props.changeWordsCount.increment}
          decrement={props.changeWordsCount.decrement}
          onChange={props.changeWordsCount.onChange}
          count={props.count}
        />
      </div>
      <div className={Style.button}>
        <Button text="Create" color="#95C6FF" onClick={props.getWords} />
      </div>
    </div>
  );
};

export default CreateIdea;
