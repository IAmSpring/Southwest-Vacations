import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
// Assuming you will have a global stylesheet or Tailwind setup
import './index.css';

const queryClient = new QueryClient();

// Get the base path for assets
const repositoryName = 'Southwest-Vacations';
const basePath = process.env.NODE_ENV === 'production' ? `/${repositoryName}` : '/';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </HashRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
