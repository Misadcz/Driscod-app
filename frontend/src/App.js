import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Register from './sites/Register';
import Login from './sites/Login'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './sites/styles/App.css';
import Server from './sites/Server';

function App() {
  const location = useLocation();
  const showNavigation = location.pathname === '/';

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/channels/:server_id" element={<Server/>} />
      <Route path="/channels/:server_id/:channel_id" element={<Server/>} />
      <Route
        path="/"
        element={

          <div className="aqua-container">
            <b className="fs-1 mb-5 aqua-text">
              Welcome on Driscord!
            </b>
            {showNavigation && (
              <nav className="d-flex gap-3">
                <Link to="/register" className="aqua-link">
                  Register
                </Link>

                <Link to="/login" className="aqua-link">
                  Login
                </Link>
              </nav>
            )}
          </div>
        }
      />
    </Routes>
  );
}


export default App;
