import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/App/App';
// Import the top-level BrowserRouter component
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext'; // Ensure the path is correct


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider> {/* This ensures the context is available throughout the app */}
      <Router>
        <App />
      </Router>
    </UserProvider>
  </React.StrictMode>
);
