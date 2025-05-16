import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App.tsx';
import { isGitHubPages, REPOSITORY_NAME } from './utils/urlUtils';
// Import the CSS from the correct location
import './index.css';

// Use HashRouter for GitHub Pages and BrowserRouter for local development
const Router = isGitHubPages() ? HashRouter : BrowserRouter;

// Set the basename
// For HashRouter, this should be '/' since the path is after the hash
// For BrowserRouter, this should be '/' for development and '/<repo-name>' for production with BrowserRouter
const basePath = isGitHubPages() ? '/' : '/';

// Render app with appropriate router
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router basename={basePath}>
      <App />
    </Router>
  </React.StrictMode>,
);
