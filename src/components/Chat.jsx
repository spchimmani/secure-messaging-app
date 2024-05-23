import React, { useContext, useState } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Chat = () => {
  const { currentUser } = useContext(AuthContext);
  const { currentReceiver, updateCurrentReceiver } = useContext(ChatContext);
  const { setFriendCounter } = useContext(ChatContext);
  const navigate = useNavigate();
  const handleRemoveFriend = async () => {
    const url = `http://127.0.0.1:8000/delete-friend/${currentUser.UserID}/${currentReceiver.UserID}`;
    console.log(url);
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Read the body once
    })
    .then(obj => {
      if (obj.status === "success") {
        setFriendCounter(prev_count => prev_count + 1);
        console.log("Friend Removed");
      } else {
        console.log("Backend problem");
      }
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
    console.log("Handled remove friend");
    updateCurrentReceiver({});
    navigate("/");
  };
  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{currentReceiver && currentReceiver.DisplayName}</span>
        <button className="remove-friend-btn" onClick={handleRemoveFriend}>Remove Friend</button>
      </div>
      <Messages />
      <Input/>
    </div>
  );
};

export default Chat;
