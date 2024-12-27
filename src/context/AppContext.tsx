import React, { createContext, useContext, useReducer } from "react";

const AppContext = createContext<any>(null);

const initialState = {
  contacts: [],
  messages: [],
};

const appReducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_CONTACTS":
      return { ...state, contacts: action.payload };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
