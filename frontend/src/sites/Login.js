import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.id);  
      console.log('Token:', response.data.token);
      console.log('UserId:', response.data.id);

      axios.defaults.headers['Authorization'] = `Bearer ${response.data.token}`;

      navigate('/channels/@me');
    } catch (error) {
      console.error('Chyba při loginu:', error);

      setMessage(error?.response?.data?.error || 'Chyba při přihlášení');
    }
  };


  return (
    <div className="aqua-container">
      <b className="fs-1 mb-5 aqua-text">
        Login
      </b>

      <form onSubmit={loginUser}>
        <div className='row'>
          <label className='col aqua-text'>Username:</label>
          <input
            className='col aqua-input'
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className='row'>
          <label className='col aqua-text'>Password:</label>
          <input
            className='col aqua-input'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className='row'>
          <Link to="/register" className="aqua-link col">New here?</Link>
          <button className='col aqua-input' type="submit">Login</button>
        </div>

      </form>
      {message && <p>{message}</p>}
    </div>

  );
}

export default Login;
