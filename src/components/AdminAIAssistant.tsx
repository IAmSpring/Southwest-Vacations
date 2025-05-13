import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';
import '../styles/aiAssistant.css';

const AdminAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeThread, setActiveThread] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    adminToken,
    isAdmin,
    adminAssistantThreads,
    selectedAdminThread,
    loadAdminAssistantThreads,
    createAdminAssistantThread,
    sendMessageToAdminAssistant,
    selectAdminThread,
  } = useAdmin();

  // Load threads when component mounts
  useEffect(() => {
    if (adminToken && isAdmin) {
      loadAdminAssistantThreads();
    }
  }, [adminToken, isAdmin]);

  // Set active thread to selected thread
  useEffect(() => {
    if (selectedAdminThread) {
      setActiveThread(selectedAdminThread);
    }
  }, [selectedAdminThread]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeThread, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);

    // If opening the chat and no active thread, create one
    if (!isOpen && !activeThread && adminToken && isAdmin) {
      handleCreateNewThread();
    }
  };

  const handleCreateNewThread = async () => {
    setIsLoading(true);
    const thread = await createAdminAssistantThread('Admin Assistant Conversation');
    if (thread) {
      setActiveThread(thread);
    }
    setIsLoading(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !activeThread || isLoading) return;

    setIsLoading(true);
    const trimmedMessage = message.trim();
    setMessage('');

    // Optimistically update UI
    const tempMessage = {
      id: 'temp-' + Date.now(),
      role: 'user',
      content: trimmedMessage,
      createdAt: new Date().toISOString(),
    };

    setActiveThread(prev => ({
      ...prev,
      messages: [...prev.messages, tempMessage],
    }));

    // Send message to API
    const updatedThread = await sendMessageToAdminAssistant(activeThread.id, trimmedMessage);

    if (updatedThread) {
      setActiveThread(updatedThread);
    }

    setIsLoading(false);
  };

  const parseMessage = (content: string) => {
    try {
      // Try to parse as JSON
      const jsonData = JSON.parse(content);
      return {
        message: jsonData.message || content,
        suggestions: jsonData.suggestions || [],
      };
    } catch (e) {
      // If not valid JSON, return as plain text
      return {
        message: content,
        suggestions: [],
      };
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    // Optional: Auto-send the suggestion
    // setTimeout(() => {
    //   handleSendMessage({ preventDefault: () => {} } as React.FormEvent);
    // }, 100);
  };

  const renderMessages = () => {
    if (!activeThread || !activeThread.messages) return null;

    return activeThread.messages.map((msg: any) => {
      if (msg.role === 'system') return null; // Don't show system messages

      const isUser = msg.role === 'user';
      const messageContent = isUser ? msg.content : parseMessage(msg.content);

      return (
        <div key={msg.id} className={`message ${isUser ? 'user-message' : 'ai-message'}`}>
          <div className="message-content">
            {isUser ? (
              <p>{msg.content}</p>
            ) : (
              <>
                <p>{messageContent.message}</p>
                {messageContent.suggestions && messageContent.suggestions.length > 0 && (
                  <div className="suggestion-chips">
                    {messageContent.suggestions.map((suggestion: string, i: number) => (
                      <button
                        key={i}
                        className="suggestion-chip"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="message-timestamp">{new Date(msg.createdAt).toLocaleTimeString()}</div>
        </div>
      );
    });
  };

  if (!isAdmin || !adminToken) return null;

  return (
    <div className="admin-ai-assistant">
      {isOpen ? (
        <div className="admin-chat-container">
          <div className="admin-chat-header">
            <h3>Admin AI Assistant</h3>
            <button onClick={toggleChat} className="close-button">
              ×
            </button>
          </div>
          <div className="admin-chat-messages">
            {activeThread && activeThread.messages && activeThread.messages.length > 0 ? (
              renderMessages()
            ) : (
              <div className="empty-state">
                <p>
                  Welcome to the Admin AI Assistant. How can I help you manage Southwest Vacations?
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="admin-chat-input">
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Ask the admin assistant..."
              disabled={isLoading || !activeThread}
            />
            <button type="submit" disabled={isLoading || !message.trim() || !activeThread}>
              {isLoading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      ) : (
        <button onClick={toggleChat} className="admin-chat-button">
          Admin AI
        </button>
      )}
    </div>
  );
};

export default AdminAIAssistant;
