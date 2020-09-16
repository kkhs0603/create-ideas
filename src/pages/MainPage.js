import React, { useState } from "react";
import Layout from "../components/templates/Layout/Layout";
import NewIdea from "../components/molecules/NewIdea/NewIdea";
import CreateIdea from "../components/molecules/CreateIdea/CreateIdea";
import AddWords from "../components/molecules/AddWords/AddWords";
import SelectRandomWords from "../components/molecules/SelectRandomWords/SelectRandomWords";

import firebase from "../firebase.js";

const MainPage = (props) => {
  const [wordsCount, setWordsCount] = useState(1);
  const [words, setWords] = useState(["Hello", "React", "World"]);
  const [randomWordsCount, setRandomWordsCount] = useState(1);
  const [enable, setEnable] = useState(false);

  const [validationMessage, setValidationMessage] = useState("");
  const [word, setWord] = useState("");

  //firebaseから取得する単語
  const getWordsFromDb = async () => {
    const arr = [];
    const db = firebase.database();
    const ref = await db.ref(`${props.currentUser.uid}/words/`).once("value");
    ref.forEach((element) => {
      arr.push(element.val().word);
    });
    return arr;
  };

  //単語をランダムに並び替える
  const shuffleWords = (arr) => {
    let m = arr.length;
    while (m) {
      let i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  };

  //Wikiから単語をランダムで5個取得
  const getRandomWordsFromWiki = async () => {
    const url = `http://ja.wikipedia.org/w/api.php?format=json&action=query&list=random&rnnamespace=0&rnlimit=5`;
    const wikiData = await fetch("https://cors-anywhere.herokuapp.com/" + url);
    const wikiObj = await wikiData.json();
    return wikiObj.query.random;
  };

  const getResultWords = async () => {
    const dbWords = await getWordsFromDb();
    const shuffled = shuffleWords(dbWords);
    //firebaseに登録された単語のみ取得する時
    if (randomWordsCount < 1 || !enable) {
      const count = wordsCount > shuffled.length ? shuffled.length : wordsCount;
      const resultWords = shuffled.slice(0, count);
      setWords(resultWords);
    }
    //firebaseの単語とwikiのランダムの単語を取得する時
    if (randomWordsCount >= 1 && enable) {
      const words = shuffled.slice(0, wordsCount - randomWordsCount);
      const randomWords = await getRandomWordsFromWiki();
      const seletRandomWords = randomWords
        .map((word) => word.title)
        .slice(0, randomWordsCount);
      seletRandomWords.forEach((word) => words.push(word));
      const resultWords = shuffleWords(words);
      setWords(resultWords);
    }
  };

  const changeWordsCount = {
    increment: (count) => {
      setWordsCount(count + 1);
    },
    decrement: (count) => {
      setWordsCount(count - 1);
    },
    onChange: (count) => {
      setWordsCount(Number(count));
    },
  };

  const changeRandomWordsCount = {
    increment: (count) => {
      if (count >= 5) return;
      setRandomWordsCount(count + 1);
    },
    decrement: (count) => {
      if (count <= 0) return;
      setRandomWordsCount(count - 1);
    },
    onChange: (count) => {
      setRandomWordsCount(Number(count));
    },
  };

  const enableRandomWords = (enable) => {
    setEnable(!enable);
  };

  const writeWords = async () => {
    if (word.trim().length === 0) {
      setWord("");
      setValidationMessage("文字を入力して下さい");
      return;
    }
    setValidationMessage("");
    let db = firebase.database();
    let ref = db.ref(`${props.currentUser.uid}/words/`);
    await ref.push({ word });
    setWord("");
    console.log("db written");
  };

  return (
    <Layout>
      <NewIdea words={words} />
      <CreateIdea
        changeWordsCount={changeWordsCount}
        count={wordsCount}
        getWords={getResultWords}
      />
      <AddWords
        write={writeWords}
        setWord={(val) => setWord(val)}
        word={word}
        validationMessage={validationMessage}
      />
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