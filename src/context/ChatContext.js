import React, { createContext, useState } from 'react';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [currentReceiver, setCurrentReceiver] = useState({});
  const [friendCounter, setFriendCounter] = useState(0);
  const [messageCounter, setMessageCounter] = useState(0);

  const updateCurrentReceiver = (receiver) => {
    localStorage.setItem('currentReceiver', JSON.stringify(receiver)); // Keep this if you need to persist the receiver between reloads
    setCurrentReceiver(receiver);
  };

  return (
    <ChatContext.Provider value={{ currentReceiver, updateCurrentReceiver, friendCounter, setFriendCounter, messageCounter, setMessageCounter}}>
      {children}
    </ChatContext.Provider>
  );
};
