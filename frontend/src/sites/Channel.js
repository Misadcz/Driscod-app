import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './styles/Channel.css';

function Channel() {
  const navigate = useNavigate();
  const { server_id } = useParams();
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState();

  const listOfChannels = () => {
    if (server_id !== '@me')
      axios.post('http://localhost:5000/api/listOfChannels', { server_id })
        .then(response => {
          setChannels(response.data.channels);
        })
        .catch(error => {
          console.error('Chyba při získávání kanálů:', error);
        });
    else
      setChannels([]);
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
      .then(() => {
        listOfChannels();
      })
      .catch(error => {
        console.error('Chyba při ověřování tokenu:', error);
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate, server_id]);

  return (
    <div className="channel-list">
      {channels.length > 0 ? (
        channels.map((channel) => (
          <Link
            key={channel.id}
            to={`/channels/${server_id}/${channel.id}`}
            onClick={() => setActiveChannel(channel.id)}
          >
            <div className={`channel-list-container ${activeChannel === channel.id ? 'active' : ''}`}>
              <div>#{channel.name}</div>
            </div>
          </Link>
        ))
      ) : (
        <b>No channels</b>
      )}
    </div>
  );
}

export default Channel;
