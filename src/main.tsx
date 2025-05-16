import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App.tsx';
import { isGitHubPages, getBasePath, REPOSITORY_NAME } from './utils/urlUtils';
// Import the CSS from the correct location
import './index.css';

// Use HashRouter for GitHub Pages and BrowserRouter for local development
const Router = isGitHubPages() ? HashRouter : BrowserRouter;

// Set the basename - for BrowserRouter, use getBasePath which includes repository name when needed
const basePath = isGitHubPages() ? '/' : getBasePath();

// Render app with appropriate router
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router basename={basePath}>
      <App />
    </Router>
  </React.StrictMode>
);
