import React from 'react';
import { createRoot } from 'react-dom/client';
import VoteApp from './VoteApp';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <VoteApp />
  </React.StrictMode>
);
