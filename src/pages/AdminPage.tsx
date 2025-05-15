import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import UserManagement from '../components/UserManagement';
import AdminChatHistory from '../components/AdminChatHistory';
import { Tab } from '@headlessui/react';
import AdminAIAssistant from '../components/AdminAIAssistant';
import { useAdmin } from '../context/AdminContext';

// Declare environment variable types for Vite
declare global {
  interface ImportMeta {
    env: {
      VITE_MOCK_AUTH?: string;
      VITE_IS_GITHUB_PAGES?: string;
    };
  }
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const UserConversationReview: React.FC = () => {
  const { userThreads, selectedThread, loadUserThreads, selectThread } = useAdmin();

  useEffect(() => {
    loadUserThreads();
  }, []);

  const parseMessage = (content: string) => {
    try {
      // Try to parse as JSON
      const jsonData = JSON.parse(content);
      return {
        message: jsonData.message || content,
        suggestions: jsonData.suggestions || [],
        browserActions: jsonData.browserActions || [],
      };
    } catch (e) {
      // If not valid JSON, return as plain text
      return {
        message: content,
        suggestions: [],
        browserActions: [],
      };
    }
  };

  const renderConversationList = () => {
    if (!userThreads || userThreads.length === 0) {
      return <p>No user conversations found.</p>;
    }

    return (
      <div className="conversation-history">
        {userThreads.map(thread => (
          <div key={thread.id} className="conversation-item" onClick={() => selectThread(thread)}>
            <div className="conversation-title">{thread.title}</div>
            <div className="conversation-preview">
              {thread.messages && thread.messages.length > 0
                ? thread.messages[0].role === 'assistant'
                  ? parseMessage(thread.messages[0].content).message.substring(0, 50) + '...'
                  : thread.messages[0].content.substring(0, 50) + '...'
                : 'No messages'}
            </div>
            <div className="conversation-date">{new Date(thread.updatedAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderConversationDetail = () => {
    if (!selectedThread) {
      return <p>Select a conversation to view details.</p>;
    }

    return (
      <div className="conversation-detail">
        <h3>{selectedThread.title}</h3>
        <div className="conversation-messages">
          {selectedThread.messages.map((msg: any) => {
            if (msg.role === 'system') return null; // Don't show system messages

            const isUser = msg.role === 'user';
            const messageContent = isUser ? msg.content : parseMessage(msg.content);

            return (
              <div key={msg.id} className={`message ${isUser ? 'user-message' : 'ai-message'}`}>
                <div className="message-role">{isUser ? 'User' : 'Assistant'}</div>
                <div className="message-content">
                  {isUser ? (
                    <p>{msg.content}</p>
                  ) : (
                    <>
                      <p>{messageContent.message}</p>
                      {messageContent.browserActions &&
                        messageContent.browserActions.length > 0 && (
                          <div className="browser-actions-detail">
                            <p className="browser-actions-title">Browser Actions:</p>
                            <ul>
                              {messageContent.browserActions.map((action: any, i: number) => (
                                <li key={i}>
                                  <strong>{action.type}</strong>:{' '}
                                  {action.description ||
                                    `${
                                      action.type === 'navigate'
                                        ? action.target
                                        : action.type === 'fill'
                                          ? `${action.selector} with "${action.value}"`
                                          : action.selector
                                    }`}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      {messageContent.suggestions && messageContent.suggestions.length > 0 && (
                        <div className="suggestion-detail">
                          <p className="suggestion-title">Suggestions:</p>
                          <ul>
                            {messageContent.suggestions.map((suggestion: string, i: number) => (
                              <li key={i}>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="message-timestamp">{new Date(msg.createdAt).toLocaleString()}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="user-conversation-review">
      <h2>User Conversations</h2>
      <div className="conversation-container">
        <div className="conversation-list">
          <h3>Conversation History</h3>
          {renderConversationList()}
        </div>
        <div className="conversation-view">{renderConversationDetail()}</div>
      </div>
    </div>
  );
};

const AdminPage: React.FC = () => {
  const { isAuthenticated, user } = useAuthContext();
  const { isAdmin, setIsAdmin } = useAdmin();
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check admin authentication and role
  useEffect(() => {
    const checkAdminAuth = () => {
      setIsLoading(true);
      
      // First check if authenticated
      if (!isAuthenticated) {
        navigate('/login?redirect=admin', { replace: true });
        return;
      }
      
      // Then check if user has admin role
      if (user?.role !== 'admin' && !isAdmin) {
        // For GitHub Pages deployment, check if we can use a mock admin
        if (isGitHubPages() && user) {
          const mockAdminEmail = 'admin@southwestvacations.com';
          if (user.email === mockAdminEmail) {
            // Set admin status in context
            setIsAdmin(true);
            setIsLoading(false);
            return;
          }
        }
        
        // If no admin access, redirect to home with message
        navigate('/', { 
          replace: true,
          state: { 
            message: 'Access denied: You need admin privileges to access this page.',
            messageType: 'error'
          } 
        });
        return;
      }
      
      setIsLoading(false);
    };
    
    checkAdminAuth();
  }, [isAuthenticated, user, isAdmin, navigate, setIsAdmin]);

  // Helper function to detect if running on GitHub Pages
  const isGitHubPages = () => {
    return (
      import.meta.env.VITE_MOCK_AUTH === 'true' || 
      import.meta.env.VITE_IS_GITHUB_PAGES === 'true' ||
      window.location.hostname.includes('github.io') ||
      (!window.location.hostname.includes('localhost') && window.location.hostname !== '127.0.0.1')
    );
  };

  // Show loading indicator
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[#0054a6]"></div>
          <p className="text-lg font-medium text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // At this point, we know the user is authenticated and has admin privileges
  return (
    <div className="admin-page container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-[#304CB2]">Admin Dashboard</h1>

      <div className="mb-8">
        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          <Tab.List className="flex rounded-xl bg-gray-100 p-1">
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-[#304CB2] focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-[#0054a6] text-white shadow'
                    : 'text-gray-600 hover:bg-[#0054a6]/70 hover:text-white'
                )
              }
            >
              User Management
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-[#304CB2] focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-[#0054a6] text-white shadow'
                    : 'text-gray-600 hover:bg-[#0054a6]/70 hover:text-white'
                )
              }
            >
              Chat History
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-[#304CB2] focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-[#0054a6] text-white shadow'
                    : 'text-gray-600 hover:bg-[#0054a6]/70 hover:text-white'
                )
              }
            >
              AI Conversations
            </Tab>
          </Tab.List>

          <Tab.Panels className="mt-2">
            <Tab.Panel
              className={classNames(
                'rounded-xl bg-white p-3',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
              )}
            >
              <UserManagement />
            </Tab.Panel>
            <Tab.Panel
              className={classNames(
                'rounded-xl bg-white p-3',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
              )}
            >
              <AdminChatHistory />
            </Tab.Panel>
            <Tab.Panel
              className={classNames(
                'rounded-xl bg-white p-3',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
              )}
            >
              <UserConversationReview />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Admin AI Assistant is always accessible regardless of which tab is active */}
      <AdminAIAssistant />
    </div>
  );
};

export default AdminPage;
