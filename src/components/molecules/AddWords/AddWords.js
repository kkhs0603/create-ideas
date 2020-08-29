import React, { useState } from 'react';
import Style from './AddWords.module.scss';
import Label from '../../atoms/Label/Label';
import Button from '../../atoms/Button/Button';
import firebase from '../../../firebase';

const AddWords = () => {
  const [validationMessage, setValidationMessage] = useState('');
  const [word, setWord] = useState('');
  const WriteWords = () => {
    if (word.trim().length === 0) {
      setWord('');
      setValidationMessage('文字を入力して下さい');
      return;
    }
    setValidationMessage('');
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        let db = firebase.database();
        let ref = db.ref(`${user.uid}/words/`);
        ref
          .push({ word })
          .then(() => {
            setWord('');
            console.log('db written');
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        console.log('no user');
      }
    });
  };
  return (
    <div className={Style.addWords}>
      <div className={Style.label}>
        <Label text="Add Words" />
      </div>
      <input
        type="text"
        onChange={(e) => {
          setWord(e.target.value);
        }}
        value={word}
      />
      {validationMessage && <span className={Style.errorMessage}>{validationMessage}</span>}
      <Button text="Add" color="#FFC895" onClick={WriteWords} />
    </div>
  );
};

export default AddWords;
