import React from 'react';
import { SelectedWords } from '../../atoms/SelectedWords/SelectedWords';
import Style from './NewIdea.module.scss';

const NewIdea = () => {
  return (
    <div className={Style.newIdea}>
      {/* <div className={Style.saveButton}>
        <Button text='Save' color='Green' imgBtn={false}/>
      </div> */}
      <div className={Style.selectedWords}>
        <SelectedWords />
      </div>
    </div>
  );
};

export default NewIdea;
