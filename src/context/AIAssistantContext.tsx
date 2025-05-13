import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuthContext } from './AuthContext';

// Define types for our context
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface Thread {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  type: string;
  params: Record<string, any>;
}

// Add browser control action interface
export interface BrowserControlAction {
  type: 'navigate' | 'click' | 'fill' | 'scroll' | 'highlight';
  target?: string;
  value?: string;
  selector?: string;
  description?: string;
}

interface AIAssistantContextType {
  threads: Thread[];
  activeThread: Thread | null;
  isExpanded: boolean;
  isLoading: boolean;
  error: string | null;
  createThread: (title?: string) => Promise<Thread>;
  getThread: (threadId: string) => Promise<Thread | null>;
  sendMessage: (content: string) => Promise<void>;
  getAllThreads: () => Promise<Thread[]>;
  setActiveThread: (threadId: string) => Promise<void>;
  toggleExpanded: () => void;
  executeTask: (task: Task) => Promise<boolean>;
  executeBrowserAction: (action: BrowserControlAction) => void;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

// Local storage keys
const LOCAL_ANONYMOUS_THREAD_KEY = 'swv_anonymous_chat_thread';
const LOCAL_CHAT_EXPANDED_KEY = 'swv_chat_expanded';

export const AIAssistantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuthContext();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThread, setActiveThreadState] = useState<Thread | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(
    localStorage.getItem(LOCAL_CHAT_EXPANDED_KEY) === 'true'
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize or load saved anonymous thread
  useEffect(() => {
    // If no active thread and not loading, try to load anonymous thread from localStorage
    if (!activeThread && !isLoading) {
      console.log('Initializing AI thread...');
      const savedAnonymousThread = localStorage.getItem(LOCAL_ANONYMOUS_THREAD_KEY);

      if (savedAnonymousThread) {
        try {
          console.log('Found saved anonymous thread, loading it...');
          const parsedThread = JSON.parse(savedAnonymousThread) as Thread;
          setActiveThreadState(parsedThread);
          console.log('Anonymous thread loaded successfully');
        } catch (err) {
          console.error('Error parsing saved anonymous thread:', err);
          // If error parsing, create a new one
          console.log('Creating new anonymous thread due to parsing error');
          createAnonymousThread().catch(console.error);
        }
      } else {
        // No saved thread, create a new one
        console.log('No saved thread found, creating new anonymous thread');
        createAnonymousThread().catch(console.error);
      }
    }
  }, []);

  // Save expanded state to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_CHAT_EXPANDED_KEY, isExpanded.toString());
  }, [isExpanded]);

  // Fetch threads when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      getAllThreads()
        .then(fetchedThreads => {
          // If we have an anonymous thread with messages and there are no existing threads or none with messages
          const anonymousThread = localStorage.getItem(LOCAL_ANONYMOUS_THREAD_KEY);
          if (anonymousThread) {
            const parsedAnonymousThread = JSON.parse(anonymousThread) as Thread;

            if (parsedAnonymousThread.messages.length > 1) {
              // Has messages beyond the system message
              const hasThreadsWithMessages = fetchedThreads.some(t => t.messages.length > 1);

              if (!hasThreadsWithMessages) {
                // Transfer the anonymous thread to the user account
                migrateAnonymousThread(parsedAnonymousThread, user.id).catch(console.error);
              }
            }
          }
        })
        .catch(console.error);
    }
  }, [isAuthenticated, user]);

  // Create anonymous thread for non-authenticated users
  const createAnonymousThread = useCallback(async (): Promise<Thread> => {
    const newThread: Thread = {
      id: uuidv4(),
      userId: 'anonymous',
      title: 'Vacation Assistant',
      messages: [
        {
          id: uuidv4(),
          role: 'system',
          content:
            'I am an AI assistant for Southwest Vacations. I can help you find destinations, answer questions about bookings, and provide travel recommendations.',
          createdAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          role: 'assistant',
          content: JSON.stringify({
            message: 'Ask me anything about Southwest Vacations!',
            suggestions: [
              'What destinations do you offer?',
              'Tell me about package deals',
              'How do I book a flight?',
            ],
            status: 'success',
            timestamp: new Date().toISOString(),
          }),
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store in localStorage
    localStorage.setItem(LOCAL_ANONYMOUS_THREAD_KEY, JSON.stringify(newThread));
    setActiveThreadState(newThread);

    return newThread;
  }, []);

  // Migrate anonymous thread to user account
  const migrateAnonymousThread = async (anonymousThread: Thread, userId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      // Create a new thread with the user's ID but maintain chat history
      const threadToMigrate = {
        ...anonymousThread,
        userId,
        title: 'Migrated Conversation',
      };

      const response = await fetch('/api/ai/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(threadToMigrate),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to migrate anonymous thread');
      }

      const migratedThread = await response.json();

      // Update state with the migrated thread
      setThreads(prevThreads => [...prevThreads, migratedThread]);
      setActiveThreadState(migratedThread);

      // Clear anonymous thread from localStorage
      localStorage.removeItem(LOCAL_ANONYMOUS_THREAD_KEY);
    } catch (err) {
      console.error('Error migrating anonymous thread:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createThread = useCallback(
    async (title?: string): Promise<Thread> => {
      // If not authenticated, create or use existing anonymous thread
      if (!isAuthenticated || !user) {
        const existingThread = localStorage.getItem(LOCAL_ANONYMOUS_THREAD_KEY);
        if (existingThread) {
          return JSON.parse(existingThread);
        }
        return createAnonymousThread();
      }

      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/ai/threads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.id,
            title: title || 'New Conversation',
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create thread');
        }

        const newThread = await response.json();
        setThreads(prevThreads => [...prevThreads, newThread]);
        setActiveThreadState(newThread);
        return newThread;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error creating thread:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, user, createAnonymousThread]
  );

  const getThread = useCallback(
    async (threadId: string): Promise<Thread | null> => {
      // For anonymous users, get thread from localStorage
      if (!isAuthenticated || !user) {
        const savedThread = localStorage.getItem(LOCAL_ANONYMOUS_THREAD_KEY);
        if (savedThread) {
          const thread = JSON.parse(savedThread) as Thread;
          if (thread.id === threadId) {
            return thread;
          }
        }
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/ai/threads/${threadId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to get thread');
        }

        const thread = await response.json();
        return thread;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error getting thread:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, user]
  );

  const sendMessage = useCallback(
    async (content: string): Promise<void> => {
      console.log('sendMessage called with content:', content);

      if (!activeThread) {
        console.error('No active thread to send message to');
        throw new Error('No active thread to send message to');
      }

      setIsLoading(true);
      setError(null);

      try {
        // Create a temporary optimistic message to show immediately
        const tempMessageId = uuidv4();
        const tempMessage: Message = {
          id: tempMessageId,
          role: 'user',
          content,
          createdAt: new Date().toISOString(),
        };

        console.log('Adding user message to thread:', tempMessage);

        // Update the UI optimistically
        const updatedThread = {
          ...activeThread,
          messages: [...activeThread.messages, tempMessage],
          updatedAt: new Date().toISOString(),
        };
        setActiveThreadState(updatedThread);

        // For anonymous users, handle locally
        if (!isAuthenticated || !user || activeThread.userId === 'anonymous') {
          console.log('Handling message locally for anonymous user');
          // Save updated thread to localStorage
          localStorage.setItem(LOCAL_ANONYMOUS_THREAD_KEY, JSON.stringify(updatedThread));

          // Generate a mock response after a short delay
          console.log('Generating mock AI response...');
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Create mock AI response
          const mockResponse = await createMockAIResponse(content);
          console.log('Mock AI response generated:', mockResponse);

          // Add AI response to thread
          const threadWithResponse = {
            ...updatedThread,
            messages: [...updatedThread.messages, mockResponse],
            updatedAt: new Date().toISOString(),
          };

          console.log('Updating thread with AI response');
          setActiveThreadState(threadWithResponse);
          localStorage.setItem(LOCAL_ANONYMOUS_THREAD_KEY, JSON.stringify(threadWithResponse));
          return;
        }

        // For authenticated users, send to API
        // Update threads list
        setThreads(prevThreads =>
          prevThreads.map(t => (t.id === activeThread.id ? updatedThread : t))
        );

        // Send message to API
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/ai/threads/${activeThread.id}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to send message');
        }

        // Get the API response with the assistant's response
        const threadWithResponse = await response.json();
        setActiveThreadState(threadWithResponse);

        // Update threads list with the complete thread including AI response
        setThreads(prevThreads =>
          prevThreads.map(t => (t.id === activeThread.id ? threadWithResponse : t))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error sending message:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, user, activeThread]
  );

  // Create a mock AI response for anonymous users
  const createMockAIResponse = async (userMessage: string): Promise<Message> => {
    // Simple responses based on user input
    const lowercaseMessage = userMessage.toLowerCase();

    // Create response object
    const jsonResponse: any = {
      message: '',
      suggestions: [] as string[],
      status: 'success' as 'success' | 'error',
      timestamp: new Date().toISOString(),
    };

    if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi')) {
      jsonResponse.message = 'Hello! How can I help you with your Southwest Vacations plans today?';
      jsonResponse.suggestions = [
        'Tell me about popular destinations',
        'How do I book a flight?',
        'What deals are available now?',
      ];
    } else if (lowercaseMessage.includes('booking') || lowercaseMessage.includes('reservation')) {
      jsonResponse.message =
        'I can help you with your booking. What specific information do you need about your reservation?';
      jsonResponse.suggestions = [
        'How do I modify my booking?',
        'Can I add hotel to my flight reservation?',
        "What's your cancellation policy?",
      ];
    } else if (lowercaseMessage.includes('flight') || lowercaseMessage.includes('flights')) {
      jsonResponse.message =
        'Southwest Airlines offers flights to many destinations. When are you planning to travel and where would you like to go?';
      jsonResponse.suggestions = [
        'Show me flights to Hawaii',
        "What's included in my flight?",
        'Do you offer international flights?',
      ];
    } else if (lowercaseMessage.includes('hotel') || lowercaseMessage.includes('accommodation')) {
      jsonResponse.message =
        'We have partnered with many quality hotels. What destination are you interested in, and what amenities are most important to you?';
      jsonResponse.suggestions = [
        'Do you have all-inclusive resorts?',
        'What hotel amenities are available?',
        'Can I book just a hotel without flights?',
      ];
    } else {
      jsonResponse.message =
        'Thank you for your message. How else can I assist you with your Southwest Vacations experience?';
      jsonResponse.suggestions = [
        'Tell me about your services',
        'I need help with a booking',
        'What destinations do you offer?',
      ];
    }

    // Serialize the JSON response
    const responseContent = JSON.stringify(jsonResponse);

    // Create the AI message
    return {
      id: uuidv4(),
      role: 'assistant',
      content: responseContent,
      createdAt: new Date().toISOString(),
    };
  };

  const getAllThreads = useCallback(async (): Promise<Thread[]> => {
    if (!isAuthenticated || !user) {
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ai/threads', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get threads');
      }

      const threadsData = await response.json();
      setThreads(threadsData);
      return threadsData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error getting threads:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const setActiveThread = useCallback(
    async (threadId: string) => {
      const thread = threads.find(t => t.id === threadId);
      if (thread) {
        setActiveThreadState(thread);
        // Expand chat when setting active thread
        setIsExpanded(true);
      }
    },
    [threads]
  );

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // Method to execute tasks sent by AI assistant
  const executeTask = useCallback(async (task: Task): Promise<boolean> => {
    console.log('Executing task:', task);

    try {
      // Here you would implement task handling logic based on task.type
      // For example:
      switch (task.type) {
        case 'navigate':
          if (task.params?.path) {
            window.location.href = task.params.path;
            return true;
          }
          break;
        case 'scrollTo':
          if (task.params?.elementId) {
            const element = document.getElementById(task.params.elementId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
              return true;
            }
          }
          break;
        case 'highlight':
          if (task.params?.elementId) {
            const element = document.getElementById(task.params.elementId);
            if (element) {
              // Add highlight class and remove after 3 seconds
              element.classList.add('ai-assistant-highlight');
              setTimeout(() => {
                element.classList.remove('ai-assistant-highlight');
              }, 3000);
              return true;
            }
          }
          break;
        // Add more task types as needed
      }

      return false;
    } catch (error) {
      console.error('Error executing task:', error);
      return false;
    }
  }, []);

  // Add executeBrowserAction function
  const executeBrowserAction = (action: BrowserControlAction) => {
    console.log('Executing browser action:', action);

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

            // Remove highlight after 3 seconds
            setTimeout(() => {
              element.classList.remove('ai-highlight');
            }, 3000);
          }
        }
        break;
    }
  };

  const value = {
    threads,
    activeThread,
    isExpanded,
    isLoading,
    error,
    createThread,
    getThread,
    sendMessage,
    getAllThreads,
    setActiveThread,
    toggleExpanded,
    executeTask,
    executeBrowserAction,
  };

  return <AIAssistantContext.Provider value={value}>{children}</AIAssistantContext.Provider>;
};

export const useAIAssistant = () => {
  const context = useContext(AIAssistantContext);
  if (context === undefined) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
};
