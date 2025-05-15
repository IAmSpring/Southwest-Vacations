import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App.tsx';
// Assuming you will have a global stylesheet or Tailwind setup
import './styles/index.css';

// Get base path for GitHub Pages
const repositoryName = 'Southwest-Vacations';
const isGitHubPages = () => {
  return (
    import.meta.env.VITE_MOCK_AUTH === 'true' || 
    import.meta.env.VITE_IS_GITHUB_PAGES === 'true' ||
    window.location.hostname.includes('github.io') ||
    (!window.location.hostname.includes('localhost') && window.location.hostname !== '127.0.0.1')
  );
};

// Use HashRouter for GitHub Pages and BrowserRouter for local development
const Router = isGitHubPages() ? HashRouter : BrowserRouter;
const basePath = isGitHubPages() ? `/${repositoryName}` : '/';

// Render app with appropriate router
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router basename={isGitHubPages() ? undefined : basePath}>
      <App />
    </Router>
  </React.StrictMode>,
);
