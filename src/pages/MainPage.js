import React, { useState } from "react";
import Layout from "../components/templates/Layout/Layout";
import NewIdea from "../components/molecules/NewIdea/NewIdea";
import CreateIdea from "../components/molecules/CreateIdea/CreateIdea";
import AddWords from "../components/molecules/AddWords/AddWords";
import SelectRandomWords from "../components/molecules/SelectRandomWords/SelectRandomWords";

import firebase from "../firebase.js";

const MainPage = () => {
  const [wordsCount, setWordsCount] = useState(1);
  const [words, setWords] = useState(["Hello", "React", "World"]);
  const [randomWordsCount, setRandomWordsCount] = useState(1);
  const [enable, setEnable] = useState(false);
  const getWords = () => {
    //TODO: 肥大化したメソッドを分割
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const db = firebase.database();
        const ref = db.ref(`${user.uid}/words/`);
        const arr = [];
        ref
          .once("value")
          .then((data) => {
            data.forEach((element) => {
              arr.push(element.val().word);
            });
            let m = arr.length;
            while (m) {
              let i = Math.floor(Math.random() * m--);
              [arr[m], arr[i]] = [arr[i], arr[m]];
            }

            if (randomWordsCount > 0 && enableRandomWords) {
              const url = `http://ja.wikipedia.org/w/api.php?format=json&action=query&list=random&rnnamespace=0&rnlimit=10`;
              fetch("https://cors-anywhere.herokuapp.com/" + url)
                .then((res) => res.json())
                .then((data) => {
                  let resultWords = [];
                  let count = wordsCount > arr.length ? arr.length : wordsCount;
                  if (count - randomWordsCount > 0) {
                    count = count - randomWordsCount;
                    resultWords = arr.slice(0, count);
                  } else {
                    count = wordsCount;
                  }
                  if (wordsCount - randomWordsCount < 0) {
                    setRandomWordsCount(wordsCount);
                  }
                  // randomWordsCount =
                  //   wordsCount - randomWordsCount < 0
                  //     ? wordsCount
                  //     : randomWordsCount;
                  const gotRandomWord = data.query.random
                    .filter((v, k) => k < randomWordsCount)
                    .map((v) => v.title);
                  gotRandomWord.forEach((element) => {
                    resultWords.push(element);
                  });
                  let m = resultWords.length;
                  while (m) {
                    let i = Math.floor(Math.random() * m--);
                    [resultWords[m], resultWords[i]] = [
                      resultWords[i],
                      resultWords[m],
                    ];
                  }
                  setWords(resultWords);
                });
            } else {
              let count = wordsCount > arr.length ? arr.length : wordsCount;
              let resultWords = arr.slice(0, count);
              setWords(resultWords);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        console.log("no user");
      }
    });
  };

  const changeWordsCount = {
    increment: (count) => {
      setWordsCount(count + 1);
    },
    decrement: (count) => {
      setWordsCount(count - 1);
    },
    onChange: (count) => {
      setWordsCount(count);
    },
  };

  const changeRandomWordsCount = {
    increment: (count) => {
      setRandomWordsCount(count + 1);
    },
    decrement: (count) => {
      setRandomWordsCount(count - 1);
    },
    onChange: (count) => {
      setRandomWordsCount(count);
    },
  };

  const enableRandomWords = (enable) => {
    setEnable(!enable);
  };
  return (
    <Layout>
      <NewIdea words={words} />
      <CreateIdea
        changeWordsCount={changeWordsCount}
        count={wordsCount}
        getWords={getWords}
      />
      <AddWords />
      <SelectRandomWords
        changeRandomWordsCount={changeRandomWordsCount}
        count={randomWordsCount}
        enableRandomWords={enableRandomWords}
        enable={enable}
      />
    </Layout>
  );
};

export default MainPage;
