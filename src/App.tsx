import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { NotificationProvider } from './context/NotificationContext';
import { AdminProvider } from './context/AdminContext';
import { AIAssistantProvider } from './context/AIAssistantContext';
import AIAssistant from './components/AIAssistant';
import AppRoutes from './AppRoutes';

const App: React.FC = () => {
  return (
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
  );
};

export default App;
