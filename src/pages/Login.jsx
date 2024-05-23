import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { updateCurrentUser } = useContext(AuthContext);
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    const url = `http://127.0.0.1:8000/login`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
      }).then(response => {
        return response.json(); // Read the body once
      })

      if (response.status === 'success') {
        console.log("Login Successfull");
        console.log(JSON.parse(response.data.user));
        updateCurrentUser(JSON.parse(response.data.user));
        navigate("/");
      } else {
        console.log('Login Failed');
        setErr(true);
      }
    } catch (error) {
      console.error('Error making the request:', error);
    }
  }
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Secure-Messaging-App</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <button>Sign in</button>
          {err && <span>Something went wrong</span>}
        </form>
        <p>You don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
