import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App.tsx';
import { isGitHubPages } from './utils/urlUtils';
// Import the CSS from the correct location
import './index.css';

// Performance monitoring - record start time
if (process.env.NODE_ENV !== 'production') {
  console.time('App Render Time');

  // Listen for first contentful paint
  const paintObserver = new PerformanceObserver(entries => {
    entries.getEntries().forEach(entry => {
      console.log(`${entry.name}: ${entry.startTime.toFixed(0)}ms`);
    });
  });
  paintObserver.observe({ type: 'paint', buffered: true });

  // Listen for largest contentful paint
  const lcpObserver = new PerformanceObserver(entries => {
    const lastEntry = entries.getEntries().pop();
    if (lastEntry) {
      console.log(`Largest Contentful Paint: ${lastEntry.startTime.toFixed(0)}ms`);
    }
  });
  lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
}

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

// Log when app is fully rendered
if (process.env.NODE_ENV !== 'production') {
  window.addEventListener('load', () => {
    console.timeEnd('App Render Time');
    console.log('Total resources loaded:', performance.getEntriesByType('resource').length);
  });
}
