import React, { useState, useEffect, useRef } from 'react';
import { useAIAssistant, Message } from '../context/AIAssistantContext';
import '../styles/aiAssistant.css';

const AIAssistant: React.FC = () => {
  const { activeThread, isExpanded, isLoading, error, createThread, sendMessage, toggleExpanded } =
    useAIAssistant();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus the input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeThread?.messages]);

  // Create a new thread if none exists
  useEffect(() => {
    if (!activeThread && !isLoading) {
      createThread().catch(console.error);
    }
  }, [activeThread, createThread, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isLoading) return;

    const message = inputValue;
    setInputValue('');
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // If the chat is collapsed, show the bubble button
  if (!isExpanded) {
    return (
      <button
        onClick={toggleExpanded}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Open AI Assistant"
      >
        <span className="text-2xl">💬</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-96 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-blue-600 p-4 text-white">
        <h3 className="font-medium">AI Assistant</h3>
        <button
          onClick={toggleExpanded}
          className="text-white hover:text-gray-200 focus:outline-none"
          aria-label="Close AI Assistant"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {!activeThread?.messages?.length ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            <p>Ask me anything about Southwest Vacations!</p>
          </div>
        ) : (
          <>
            {activeThread.messages.map((message: Message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="border-t border-red-200 bg-red-50 p-2 text-sm text-red-600">{error}</div>
      )}

      {/* Input area */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white p-4">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full resize-none rounded-md border border-gray-300 p-2 pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || inputValue.trim() === ''}
            className="absolute bottom-2 right-2 text-blue-600 hover:text-blue-800 focus:outline-none disabled:text-gray-400 disabled:hover:text-gray-400"
          >
            {isLoading ? (
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const { sendMessage } = useAIAssistant();

  // Try to parse JSON content for assistant messages
  let parsedContent = null;
  let displayContent = message.content;
  let suggestions: string[] = [];

  if (!isUser && message.content) {
    try {
      parsedContent = JSON.parse(message.content);
      if (parsedContent && parsedContent.message) {
        displayContent = parsedContent.message;
        suggestions = parsedContent.suggestions || [];
      }
    } catch (e) {
      // Not JSON or invalid JSON, use the raw content
      console.log('Not a JSON response or invalid JSON, using raw content');
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion).catch(console.error);
  };

  return (
    <div className={`mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex max-w-[80%] flex-col rounded-lg px-4 py-2 ${
          isUser
            ? 'rounded-br-none bg-blue-600 text-white'
            : 'rounded-bl-none border border-gray-200 bg-white text-gray-800'
        }`}
      >
        <p className="whitespace-pre-wrap">{displayContent}</p>

        {/* Display suggestions if available */}
        {!isUser && suggestions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800 hover:bg-gray-200"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div
          className={`mt-1 text-xs ${isUser ? 'text-blue-200' : 'text-gray-500'}`}
          title={new Date(message.createdAt).toLocaleString()}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
