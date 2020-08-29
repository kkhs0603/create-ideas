import React, { useContext, useState } from 'react';
import Layout from '../components/templates/Layout/Layout';
import NewIdea from '../components/molecules/NewIdea/NewIdea';
import CreateIdea from '../components/molecules/CreateIdea/CreateIdea';
import AddWords from '../components/molecules/AddWords/AddWords';
import SelectRandomWords from '../components/molecules/SelectRandomWords/SelectRandomWords';

import firebase from '../firebase.js';
import { Store } from '../store/index';

const MainPage = () => {
  const { globalState, setGlobalState } = useContext(Store);
  const [wordsCount, setWordsCount] = useState(1);
  const getWords = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const db = firebase.database();
        const ref = db.ref(`${user.uid}/words/`);
        const arr = [];
        ref
          .once('value')
          .then((data) => {
            data.forEach((element) => {
              arr.push(element.val().word);
            });
            let m = arr.length;
            while (m) {
              let i = Math.floor(Math.random() * m--);
              [arr[m], arr[i]] = [arr[i], arr[m]];
            }

            if (globalState.randomWordsCount > 0 && globalState.enableRandomWords) {
              const url = `http://ja.wikipedia.org/w/api.php?format=json&action=query&list=random&rnnamespace=0&rnlimit=10`;
              fetch('https://cors-anywhere.herokuapp.com/' + url)
                .then((res) => res.json())
                .then((data) => {
                  let resultWords = [];
                  let count = wordsCount > arr.length ? arr.length : wordsCount;
                  if (count - globalState.randomWordsCount > 0) {
                    count = count - globalState.randomWordsCount;
                    resultWords = arr.slice(0, count);
                  } else {
                    count = globalState.wordsCount;
                  }
                  const randomWordsCount =
                    wordsCount - globalState.randomWordsCount < 0
                      ? wordsCount
                      : globalState.randomWordsCount;
                  const gotRandomWord = data.query.random
                    .filter((v, k) => k < randomWordsCount)
                    .map((v) => v.title);
                  gotRandomWord.forEach((element) => {
                    resultWords.push(element);
                  });
                  let m = resultWords.length;
                  while (m) {
                    let i = Math.floor(Math.random() * m--);
                    [resultWords[m], resultWords[i]] = [resultWords[i], resultWords[m]];
                  }
                  setGlobalState({ type: 'SET_WORDS', payload: { words: resultWords } });
                });
            } else {
              let count = wordsCount > arr.length ? arr.length : wordsCount;
              let resultWords = arr.slice(0, count);
              setGlobalState({ type: 'SET_WORDS', payload: { words: resultWords } });
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        console.log('no user');
      }
    });
  };

  const changeWordsCount = {
    increment: (count) => {
      setWordsCount(count + 1);
      // setGlobalState({
      //   type: 'SET_WORDS_COUNT',
      //   payload: { wordsCount: count + 1 },
      // });
    },
    decrement: (count) => {
      setGlobalState({
        type: 'SET_WORDS_COUNT',
        payload: { wordsCount: count - 1 },
      });
    },
    onChange: (count) => {
      setGlobalState({
        type: 'SET_WORDS_COUNT',
        payload: { wordsCount: count },
      });
    },
  };

  const changeRandomWordsCount = {
    increment: (count) => {
      setGlobalState({
        type: 'SET_RANDOM_WORDS_COUNT',
        payload: { randomWordsCount: count + 1 },
      });
    },
    decrement: (count) => {
      setGlobalState({
        type: 'SET_RANDOM_WORDS_COUNT',
        payload: { randomWordsCount: count - 1 },
      });
    },
    onChange: (count) => {
      setGlobalState({
        type: 'SET_RANDOM_WORDS_COUNT',
        payload: { randomWordsCount: count },
      });
    },
  };
  return (
    <Layout>
      <NewIdea />
      <CreateIdea changeWordsCount={changeWordsCount} count={wordsCount} getWords={getWords} />
      <AddWords />
      <SelectRandomWords
        changeRandomWordsCount={changeRandomWordsCount}
        count={globalState.randomWordsCount}
      />
    </Layout>
  );
};

export default MainPage;
