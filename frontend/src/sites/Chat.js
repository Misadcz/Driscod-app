import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './styles/Chat.css';
import moment from 'moment';

function Chat() {
  const navigate = useNavigate();
  const { server_id, channel_id } = useParams();
  const [messages, setMessages] = useState([]);

  const listOfMessages = () => {
    if (channel_id) {
      axios.post('http://localhost:5000/api/listOfMessages', { channel_id })
        .then(response => {
          setMessages(response.data.messages || []); 
        })
        .catch(error => {
          console.error('Chyba při získávání zpráv:', error);
        });
    } else {
      setMessages([]);
    }
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
        listOfMessages(); 
        console.log('Úspěšně ověřeno, token je platný.');
      })
      .catch(error => {
        console.error('Chyba při ověřování tokenu:', error);
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate, channel_id]); 

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      <h1 style={{ color: 'white' }}>Chat</h1>
      <div className="chat">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id}>
              <div><b>{message.username}</b> {moment(message.timestamp).format('DD/MM/YYYY HH:mm')}</div>
              <div style={{ marginLeft: '20px'}}>{message.content}</div>
            </div>
          ))
        ) : (
          <b>No messages</b>
        )}
      </div>
    </div>
  );
}

export default Chat;
