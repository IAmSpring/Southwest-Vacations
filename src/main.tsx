import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App.tsx';
import { isGitHubPages } from './utils/urlUtils';
// Import the CSS from the correct location
import './index.css';

// Use HashRouter for GitHub Pages and BrowserRouter for local development
const Router = isGitHubPages() ? HashRouter : BrowserRouter;

// For GitHub Pages with HashRouter, we don't need a basename
// For local development with BrowserRouter, we use '/'
const basePath = '/';

// Render app with appropriate router
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router basename={basePath}>
      <App />
    </Router>
  </React.StrictMode>
);
