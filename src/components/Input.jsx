import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Input = () => {
  const [text, setText] = useState("");
  const { currentUser } = useContext(AuthContext);
  const { currentReceiver } = useContext(ChatContext);
  const { setMessageCounter } = useContext(ChatContext);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };


  const handleSend = async () => {
    console.log("Handling send");
    if (text === "") return null;
    const message_body = {
      "SenderID": currentUser.UserID,
      "ReceiverID": currentReceiver.UserID,
      "TextMessage": text
    }
    // console.log(message_body);
    const url = `http://127.0.0.1:8000/message`;
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message_body),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Read the body once
    })
    .then(obj => {
      if (obj.status === "success") {
        setMessageCounter(prev_count => prev_count + 1);
        console.log("Message Added");
      } else {
        console.log("Backend problem");
      }
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
    setText("");
  };
  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyDown={handleKeyDown}
      />
      <div className="send">
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
