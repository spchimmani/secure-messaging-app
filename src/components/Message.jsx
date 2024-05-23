import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const [isCurrentUserSender, setIsCurrentUserSender] = useState(false);

  useEffect(() => {
    if (currentUser && message) {
      setIsCurrentUserSender(message.SenderID === currentUser.UserID);
    }
  }, [message, currentUser]);


  const messageBoxStyle = {
    maxWidth: '40%',
    padding: '10px',
    margin: '10px',
    borderRadius: '10px',
    backgroundColor: isCurrentUserSender ? '#DCF8C6' : '#ECECEC',
    marginLeft: isCurrentUserSender ? 'auto' : '10px',
    marginRight: isCurrentUserSender ? '10px' : 'auto',
    textAlign: isCurrentUserSender ? 'right' : 'left',
    wordWrap: 'break-word',
  };

  return (
    <div style={messageBoxStyle}>
      <div>{message.TextMessage}</div>
    </div>
  );
};

export default Message;
