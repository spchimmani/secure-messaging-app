import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Chats = () => {

  const { currentUser } = useContext(AuthContext);
  const { updateCurrentReceiver, friendCounter } = useContext(ChatContext);
  const [friendsList, setFriendsList] = useState([]);
  useEffect(() => {
    const fetchFriends = async () => {
      const url = `http://127.0.0.1:8000/get-friends/${currentUser.UserID}`;
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
          const arrayOfStringifiedObjects = obj.data.friends;
          arrayOfStringifiedObjects.forEach((str) => {
            try {
              arrayOfObjects.push(JSON.parse(str));
            } catch (e) {
              console.error('Error parsing JSON string:', str, e);
            }
          });
          setFriendsList(arrayOfObjects);
        }
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
    };

    fetchFriends();
  }, [friendCounter]);

  const handleSelect = async (u) => {
    await updateCurrentReceiver(u);
  };

  return (
    <div className="chats" style={{overflowY:'auto'}}>
      {friendsList && friendsList.map((friend) => (
        <div
          className="userChat"
          key={friend.UserID}
          onClick={() => handleSelect(friend)}
        >
        <div className="userChatInfo">
          <span>{friend.DisplayName}</span>
        </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
// const dummy_users = [
    //   {
    //     userId: 'user01',
    //     displayName: 'Alex Johnson',
    //     email: 'alex.johnson@example.com'
    //   },
    //   {
    //     userId: 'user02',
    //     displayName: 'Brianna Smith',
    //     email: 'brianna.smith@example.com'
    //   },
    //   {
    //     userId: 'user03',
    //     displayName: 'Charles Brown',
    //     email: 'charles.brown@example.com'
    //   },
    //   {
    //     userId: 'user04',
    //     displayName: 'Diana Adams',
    //     email: 'diana.adams@example.com'
    //   },
    // ];
    // console.log("Updating the friends");
    // updateFriendsList(dummy_users);