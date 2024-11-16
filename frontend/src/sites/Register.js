import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Register.css';
import 'bootstrap/dist/css/bootstrap.min.css';



function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault();
    console.log('Registrace uživatele:', { username, email, password }); 
    try {
        const response = await axios.post('http://localhost:5000/api/register', {
            username,
            email,
            password,
        });
        
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }

        setMessage(response.data.message);

        navigate('/dashboard');
    } catch (error) {
        console.error('Chyba při registraci:', error); 
        setMessage(error.response?.data?.error || 'Chyba při registraci');
    }
};

  return (

    <div className="aqua-container">
      <b className="fs-1 mb-5 aqua-text">
        Register
      </b>
      <form onSubmit={registerUser}>
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
          <label className='col aqua-text'>Email:</label>
          <input
          className='col aqua-input'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <Link to="/login" className="aqua-link col">Alread registered?</Link>
          <button className='col aqua-input' type="submit">Register</button>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
