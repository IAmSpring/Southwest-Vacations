import React, { useState, useEffect, useRef } from 'react';
import { useAIAssistant, Message } from '../context/AIAssistantContext';
import '../styles/aiAssistant.css';

const AIAssistant: React.FC = () => {
  const { activeThread, isExpanded, isLoading, error, createThread, sendMessage, toggleExpanded } =
    useAIAssistant();
  const [inputValue, setInputValue] = useState('');
  const [quickInputValue, setQuickInputValue] = useState('');
  const [showQuickInput, setShowQuickInput] = useState(false);
  const [showLatestMessage, setShowLatestMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const quickInputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const assistantRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [lastFocusedElement, setLastFocusedElement] = useState<HTMLElement | null>(null);

  // Get latest message for the bubble
  const latestMessage = activeThread?.messages
    ?.filter((m: Message) => m.role !== 'system')
    ?.slice(-1)[0];

  // Remember last focused element before opening the assistant
  useEffect(() => {
    if (isExpanded) {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && activeElement !== document.body) {
        setLastFocusedElement(activeElement);
      }
    } else if (lastFocusedElement) {
      // Restore focus when closing
      setTimeout(() => {
        lastFocusedElement.focus();
      }, 0);
    }
  }, [isExpanded, lastFocusedElement]);

  // Auto-focus the input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    } else if (showQuickInput && quickInputRef.current) {
      quickInputRef.current.focus();
    }
  }, [isExpanded, showQuickInput]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    // Show latest message in bubble when minimized
    if (!isExpanded && activeThread?.messages?.length > 0) {
      setShowLatestMessage(true);

      // Auto-hide message after 5 seconds
      const timer = setTimeout(() => {
        setShowLatestMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [activeThread?.messages, isExpanded]);

  // Create a new thread if none exists
  useEffect(() => {
    if (!activeThread && !isLoading) {
      console.log('Creating new thread...');
      createThread().catch(console.error);
    }
  }, [activeThread, createThread, isLoading]);

  // Handle escape key to close the assistant and trap focus inside
  useEffect(() => {
    if (!isExpanded && !showQuickInput) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Close on escape
      if (event.key === 'Escape') {
        if (showQuickInput) {
          setShowQuickInput(false);
        } else {
          toggleExpanded();
        }
        return;
      }

      // Trap focus inside modal with Tab
      if (event.key === 'Tab') {
        const container = isExpanded ? assistantRef.current : bubbleRef.current;
        if (!container) return;

        const focusableElements = container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        // If shift+tab pressed on first element, move to last
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
        // If tab pressed on last element, move to first
        else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded, toggleExpanded, showQuickInput]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isLoading) return;

    // Store the message before resetting input
    const message = inputValue;

    // Reset input immediately for better UX
    setInputValue('');

    console.log('Sending message:', message);

    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quickInputValue.trim() === '' || isLoading) return;

    // Store the message before resetting input
    const message = quickInputValue;

    // Reset input immediately for better UX
    setQuickInputValue('');
    setShowQuickInput(false);

    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleQuickInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleQuickSubmit(e);
    }
  };

  const toggleQuickInput = () => {
    setShowQuickInput(prev => !prev);
    setShowLatestMessage(false);
  };

  // If the chat is collapsed, show the bubble button
  if (!isExpanded) {
    return (
      <div ref={bubbleRef} className="fixed bottom-6 right-6 z-50">
        {/* Latest message bubble */}
        {showLatestMessage && latestMessage && (
          <div
            className="mb-3 max-w-[300px] rounded-lg bg-white p-3 shadow-lg"
            role="status"
            aria-live="polite"
          >
            <p className="text-sm font-medium text-gray-700">
              {latestMessage.role === 'user' ? 'You' : 'AI Assistant'}:
            </p>
            <p className="mt-1 line-clamp-3 text-sm text-gray-600">
              {latestMessage.role === 'user'
                ? latestMessage.content
                : (() => {
                    try {
                      const parsed = JSON.parse(latestMessage.content);
                      return parsed.message || latestMessage.content;
                    } catch (e) {
                      return latestMessage.content;
                    }
                  })()}
            </p>
          </div>
        )}

        {/* Quick input field */}
        {showQuickInput && (
          <div className="mb-3 flex w-[300px] flex-row items-center gap-2">
            <form onSubmit={handleQuickSubmit} className="relative flex-1">
              <input
                ref={quickInputRef}
                type="text"
                value={quickInputValue}
                onChange={e => setQuickInputValue(e.target.value)}
                onKeyDown={handleQuickInputKeyDown}
                placeholder="Type a quick message..."
                className="w-full rounded-full border border-gray-300 py-2 pl-4 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Quick message to AI Assistant"
              />
              <button
                type="submit"
                disabled={isLoading || quickInputValue.trim() === ''}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:text-gray-400"
                aria-label="Send quick message"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </form>
            <button
              onClick={() => setShowQuickInput(false)}
              className="rounded-full bg-gray-200 p-1 text-gray-500 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close quick input"
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
        )}

        {/* Main chat bubble button with notification indicator */}
        <div className="flex gap-2">
          {!showQuickInput && (
            <button
              onClick={toggleQuickInput}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-600 shadow-lg transition-all hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Type a quick message"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </button>
          )}
          <button
            onClick={toggleExpanded}
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Open AI Assistant"
            aria-expanded="false"
            aria-haspopup="dialog"
          >
            <span className="text-2xl" aria-hidden="true">
              💬
            </span>
            {activeThread?.messages?.filter(m => m.role !== 'system').length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {activeThread.messages.filter(m => m.role !== 'system').length}
              </span>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={assistantRef}
      className="fixed bottom-6 right-6 z-50 flex h-[500px] w-96 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl"
      role="dialog"
      aria-labelledby="ai-assistant-title"
      aria-modal="true"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-blue-600 p-4 text-white">
        <h3 className="font-medium" id="ai-assistant-title">
          AI Assistant
        </h3>
        <button
          ref={closeButtonRef}
          onClick={toggleExpanded}
          className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close AI Assistant"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
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
      <div
        className="flex-1 overflow-y-auto bg-gray-50 p-4"
        aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions"
        role="log"
      >
        {!activeThread?.messages?.length ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            <p>Ask me anything about Southwest Vacations!</p>
          </div>
        ) : (
          <>
            {activeThread.messages
              .filter(m => m.role !== 'system')
              .map((message: Message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            <div ref={messagesEndRef} tabIndex={-1} aria-hidden="true" />
          </>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div
          className="border-t border-red-200 bg-red-50 p-2 text-sm text-red-600"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      {/* Input area */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white p-4">
        <div className="relative">
          <label htmlFor="ai-assistant-input" className="sr-only">
            Type your message
          </label>
          <textarea
            id="ai-assistant-input"
            ref={inputRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full resize-none rounded-md border border-gray-300 p-2 pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
            disabled={isLoading}
            aria-disabled={isLoading}
            aria-describedby="assistant-input-hint"
          />
          <button
            type="submit"
            disabled={isLoading || inputValue.trim() === ''}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:text-gray-400 disabled:hover:text-gray-400"
            aria-label="Send message"
          >
            {isLoading ? (
              <svg
                className="h-5 w-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
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
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
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
        <div className="mt-2 text-xs text-gray-500" id="assistant-input-hint">
          <p>Press Enter to send, Shift+Enter for new line, Escape to close</p>
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

  const handleSuggestionKeyDown = (e: React.KeyboardEvent, suggestion: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      sendMessage(suggestion).catch(console.error);
    }
  };

  return (
    <div
      className={`mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}
      role={isUser ? 'none' : 'region'}
      aria-label={isUser ? undefined : 'AI Assistant response'}
    >
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
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Suggested responses">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => handleSuggestionClick(suggestion)}
                onKeyDown={e => handleSuggestionKeyDown(e, suggestion)}
                aria-label={`Suggest: ${suggestion}`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div
          className={`mt-1 text-xs ${isUser ? 'text-blue-200' : 'text-gray-500'}`}
          title={new Date(message.createdAt).toLocaleString()}
          aria-hidden="true"
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

// Add interface for browser control actions
interface BrowserControlAction {
  type: 'navigate' | 'click' | 'fill' | 'scroll' | 'highlight';
  target?: string;
  value?: string;
  selector?: string;
  description?: string;
}

// Add browser control function
const executeBrowserAction = (action: BrowserControlAction) => {
  switch (action.type) {
    case 'navigate':
      if (action.target) {
        window.location.href = action.target;
      }
      break;

    case 'click':
      if (action.selector) {
        const element = document.querySelector(action.selector) as HTMLElement;
        if (element) {
          element.click();
        }
      }
      break;

    case 'fill':
      if (action.selector && action.value) {
        const element = document.querySelector(action.selector) as HTMLInputElement;
        if (element) {
          element.value = action.value;
          // Dispatch input event to trigger any listeners
          const event = new Event('input', { bubbles: true });
          element.dispatchEvent(event);
        }
      }
      break;

    case 'scroll':
      if (action.selector) {
        const element = document.querySelector(action.selector);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      break;

    case 'highlight':
      if (action.selector) {
        // Remove any previous highlights
        const previousHighlights = document.querySelectorAll('.ai-highlight');
        previousHighlights.forEach(el => {
          el.classList.remove('ai-highlight');
        });

        // Add new highlight
        const element = document.querySelector(action.selector);
        if (element) {
          element.classList.add('ai-highlight');
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });

          // Add accessible announcement for screen readers
          const announcement = document.createElement('div');
          announcement.setAttribute('role', 'status');
          announcement.setAttribute('aria-live', 'polite');
          announcement.classList.add('sr-only');
          announcement.textContent = `Highlighting ${action.description || 'element'}`;
          document.body.appendChild(announcement);

          // Remove highlight and announcement after 3 seconds
          setTimeout(() => {
            element.classList.remove('ai-highlight');
            document.body.removeChild(announcement);
          }, 3000);
        }
      }
      break;
  }
};

// Update parseMessage function to handle browser control actions
const parseMessage = (content: string) => {
  try {
    // Try to parse as JSON
    const jsonData = JSON.parse(content);

    // Check if message contains browser control actions
    if (jsonData.browserActions && Array.isArray(jsonData.browserActions)) {
      // Execute each browser action
      jsonData.browserActions.forEach((action: BrowserControlAction) => {
        executeBrowserAction(action);
      });
    }

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

// Update the renderMessages function to include information about browser control actions
const renderMessages = (activeThread: any, handleSuggestionClick: (suggestion: string) => void) => {
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
              {messageContent.browserActions && messageContent.browserActions.length > 0 && (
                <div className="browser-actions-info">
                  <p className="browser-actions-note">
                    <small>
                      <i>The assistant is helping navigate the page</i>
                    </small>
                  </p>
                </div>
              )}
              {messageContent.suggestions && messageContent.suggestions.length > 0 && (
                <div className="suggestion-chips" role="group" aria-label="Suggested responses">
                  {messageContent.suggestions.map((suggestion: string, i: number) => (
                    <button
                      key={i}
                      className="suggestion-chip"
                      onClick={() => handleSuggestionClick(suggestion)}
                      aria-label={`Suggest: ${suggestion}`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <div className="message-timestamp" aria-hidden="true">
          {new Date(msg.createdAt).toLocaleTimeString()}
        </div>
      </div>
    );
  });
};

export default AIAssistant;
