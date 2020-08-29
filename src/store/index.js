import React, { createContext, useReducer } from "react";

const initialState = {
  user: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload.user };
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
      <Store.Provider value={{ globalState, setGlobalState }}>
        {children}
      </Store.Provider>
    </div>
  );
};
