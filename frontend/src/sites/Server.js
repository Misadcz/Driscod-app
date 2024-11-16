import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './styles/Server.css';
import home from '../images/home.png';
import App from "../App";
import Chat from "./Chat";
import Channel from "./Channel";


function Server() {
  const navigate = useNavigate();
  const [servers, setServers] = useState([]);
  const [activeServer, setActiveServer] = useState(null);

  const listOfServers = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID is missing');
      return;
    }
    axios.post('http://localhost:5000/api/listOfServers', { user_id: userId })
      .then(response => {
        setServers(response.data.servers);
      })
      .catch(error => {
        console.error('Chyba při získávání serverů:', error);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    axios.post('http://localhost:5000/api/verify', {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        // console.log('Úspěšně ověřeno, token je platný.');
        listOfServers();

      })
      .catch(error => {
        console.error('Chyba při ověřování tokenu:', error);
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      <div className="row">
        <div className="listServer">
          <div className="aqua-container-list">
            <Link to="/channels/@me"
              onClick={() => setActiveServer('@me')}>
              <div className={`logo-list-container ${activeServer === '@me' ? 'active' : ''}`}>
                <div className="hover-line"></div>
                <img src={home} className="mt-3 logo-list" alt="Homepage" />
              </div>
            </Link>
            {servers.length > 0 ? (
              servers.map((server) => (
                <Link
                  key={server.id}
                  to={`/channels/${server.id}`}
                  onClick={() => setActiveServer(server.id)}
                >
                  <div className={`logo-list-container ${activeServer === server.id ? 'active' : ''}`}>
                    <div className="hover-line"></div>
                    <img src={server.icon} className="logo-list" alt={server.name} />
                  </div>
                </Link>

              ))
            ) : (
              <p>No servers</p>
            )}
            <button style={{ float: 'right' }} onClick={logout}>Logout</button>
          </div>
        </div>

        <div className="listChannel">
          <Channel />
        </div>

        <div className="col listMessage">
          <Chat />
        </div>

        <div className="col listServerUsers">
          <Chat />
        </div>

      </div>
    </div>
  );
}

export default Server;
