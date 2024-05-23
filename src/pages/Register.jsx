import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const { updateCurrentUser } = useContext(AuthContext);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log("Handling Submit");
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    const url = `http://127.0.0.1:8000/register`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({displayName, email, password}),
      }).then(response => {
        return response.json(); // Read the body once
      })

      if (response.status === 'success') {
        console.log("Registration Successfull");
        console.log(response.data.user);
        // localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        updateCurrentUser(response.data.user);
        navigate("/login");
      } else {
        console.err('Registration Failed');
        setErr(true);
      }
    } catch (err) {
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Secure-Messaging-App</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="display name" />
          <input required type="email" placeholder="email" />
          <input required type="password" placeholder="password" />
          <button disabled={loading}>Sign up</button>
          {loading && "Uploading and compressing the image please wait..."}
          {err && <span>Something went wrong</span>}
        </form>
      </div>
    </div>
  );
};

export default Register;
