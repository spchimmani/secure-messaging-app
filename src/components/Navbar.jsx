import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChatContext } from '../context/ChatContext';

const Navbar = () => {
  const { currentUser, updateCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [addingFriend, setAddingFriend] = useState(false);
  const [friendEmail, setFriendEmail] = useState('');
  const { setFriendCounter } = useContext(ChatContext);

  const handleLogout = () => {
    updateCurrentUser({});
    navigate("/login");
  };

  const handleAddFriendClick = () => {
    setAddingFriend(true);
  };

  const handleSubmitFriendEmail = () => {
    const url = `http://127.0.0.1:8000/add-friend/${currentUser.UserID}/${friendEmail}`;
    console.log(friendEmail);
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Read the body once
    })
      .then(obj => {
        console.log(obj);
        if (obj && obj.status === "success") {
          console.log("friends updated");
          setFriendCounter(prev_count => prev_count + 1);
        } else {
          console.log("friend not added");
        }
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
    setAddingFriend(false); // After submission, hide the 'Add Friend' input and show the logout button
  };

  return (
    <div className='navbar'>
      <span className="logo">Secure-Messaging-App</span>
      <div className="user">
        <span>{currentUser.DisplayName}</span>
        {addingFriend ? (
          <>
            <input
              type="email"
              placeholder="Friend's email"
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
            />
            <button onClick={handleSubmitFriendEmail}>Submit</button>
            {/* Optional: Button to cancel adding friend and show the logout button again */}
            <button onClick={() => setAddingFriend(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={handleAddFriendClick}>Add Friend</button>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
