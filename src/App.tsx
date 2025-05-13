import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import { NotificationProvider } from './context/NotificationContext';
import { AIAssistantProvider } from './context/AIAssistantContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import AppRoutes from './AppRoutes';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <NotificationProvider>
            <AIAssistantProvider>
              <div className="flex min-h-screen flex-col bg-white">
                <Header />
                <main className="flex-grow">
                  <AppRoutes />
                </main>
                <Footer />
                <AIAssistant />
              </div>
            </AIAssistantProvider>
          </NotificationProvider>
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
