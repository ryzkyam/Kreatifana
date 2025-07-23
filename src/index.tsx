// src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import App from './App'; // Import the main App component

// Render the App wrapped inside AuthProvider
ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('root') // Ensure there is an element with id="root" in your public/index.html
);
