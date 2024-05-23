import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import Message from "./Message";
import { AuthContext } from "../context/AuthContext";

const Messages = () => {
  const { currentUser } = useContext(AuthContext);
  const { currentReceiver } = useContext(ChatContext);
  const [currentMessages, setCurrentMessages] = useState([]);
  const { messageCounter } = useContext(ChatContext);


  useEffect(() => {
    const url = `http://127.0.0.1:8000/chat-history/${currentUser.UserID}/${currentReceiver.UserID}`;
    let arrayOfObjects = [];
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentUser),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Read the body once
    })
    .then(obj => {
      if (obj.status === "success") {
        const arrayOfStringifiedObjects = obj.data.messages;
        arrayOfStringifiedObjects.forEach((str) => {
          try {
            arrayOfObjects.push(JSON.parse(str));
          } catch (e) {
            console.error('Error parsing JSON string:', str, e);
          }
        });
        setCurrentMessages(arrayOfObjects);
      }
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  }, [currentReceiver, messageCounter]);

  return (
    <div className="messages">
      {currentMessages && currentMessages.map((m) => (
        <Message message={m} key={m.MessageID} /> 
      ))}
    </div>
  );
};

export default Messages;

// const dummyMessages = [
//   {
//     message_text: "Hey, how's it going?",
//     sender: "user123",
//     receiver: "user456",
//     timestamp: new Date('2024-03-17T12:00:00').getTime(),
//   },
//   {
//     message_text: "It's going great, thanks! How about you?",
//     sender: "user456",
//     receiver: "user123",
//     timestamp: new Date('2024-03-17T12:01:00').getTime(),
//   },
//   {
//     message_text: "Pretty good, just working on a project.",
//     sender: "user123",
//     receiver: "user456",
//     timestamp: new Date('2024-03-17T12:02:00').getTime(),
//   },
//   {
//     message_text: "That sounds interesting!",
//     sender: "user456",
//     receiver: "user123",
//     timestamp: new Date('2024-03-17T12:03:00').getTime(),
//   },
//   {
//     message_text: "Yeah, it's pretty cool. Almost done with it.",
//     sender: "user123",
//     receiver: "user456",
//     timestamp: new Date('2024-03-17T12:04:00').getTime(),
//   },
//   {
//     message_text: "Can't wait to see it!",
//     sender: "user456",
//     receiver: "user123",
//     timestamp: new Date('2024-03-17T12:05:00').getTime(),
//   },
// ];