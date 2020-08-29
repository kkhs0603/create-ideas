import React, { useContext } from 'react';
import Style from './SelectedWords.module.scss';
import { Store } from '../../../store/index';

export const SelectedWords = () => {
  const { globalState } = useContext(Store);
  const selected = globalState.words.map((element, i) => {
    if (i + 1 === globalState.words.length) {
      return (
        <div className={Style.selectedWords} key={i}>
          <div className={Style.word} key={element.key}>
            {element}
          </div>
        </div>
      );
    } else {
      return (
        <div className={Style.selectedWords} key={i}>
          <div className={Style.word} key={element.key}>
            {element}
          </div>
          <div className={Style.cross}>×</div>
        </div>
      );
    }
  });
  return <div className={Style.wrapper}>{selected}</div>;
};
