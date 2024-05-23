import { createContext, useEffect, useState } from "react";


export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  const updateCurrentUser = (u) => {
    localStorage.setItem('currentUser', JSON.stringify(u)); // Keep this if you need to persist the receiver between reloads
    setCurrentUser(u);
  };

  return (
    <AuthContext.Provider value={{ currentUser, updateCurrentUser}}>
      {children}
    </AuthContext.Provider>
  );
};
