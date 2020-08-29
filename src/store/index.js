import React, { createContext, useReducer } from 'react';

const initialState = {
  user: {},
  wordsCount: 1,
  words: ['Hello', 'React', 'World'],
  randomWordsCount: 1,
  randomWords: [],
  enableRandomWords: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload.user };
    case 'SET_WORDS_COUNT':
      return { ...state, wordsCount: action.payload.wordsCount };
    case 'SET_WORDS':
      return { ...state, words: action.payload.words };
    case 'SET_RANDOM_WORDS_COUNT':
      return { ...state, randomWordsCount: action.payload.randomWordsCount };
    case 'SET_RANDOM_WORDS':
      return { ...state, randomWords: action.payload.randomWords };
    case 'SET_ENABLE_RANDOM_WORDS':
      return { ...state, enableRandomWords: action.payload.enableRandomWords };
    default:
      return state;
  }
};

export const Store = createContext({
  globalState: initialState,
  setGlobalState: () => null,
});

export const StoreProvider = ({ children }) => {
  const [globalState, setGlobalState] = useReducer(reducer, initialState);
  return (
    <div>
      <Store.Provider value={{ globalState, setGlobalState }}>{children}</Store.Provider>
    </div>
  );
};
