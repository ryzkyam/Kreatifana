import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; 
import './index.css'; 

import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-Ew7_q-kf-y95T3NgffA1HIf13rZ-c7k",
  authDomain: "creativehub-2e1c8.firebaseapp.com",
  projectId: "creativehub-2e1c8",
  storageBucket: "creativehub-2e1c8.firebasestorage.app",
  messagingSenderId: "1044127081389",
  appId: "1:1044127081389:web:03f917766761ea71133724"
};

initializeApp(firebaseConfig);

// Creating the root and rendering the app
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
