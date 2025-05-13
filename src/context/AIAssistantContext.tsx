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

interface AIAssistantContextType {
  threads: Thread[];
  activeThread: Thread | null;
  isExpanded: boolean;
  isLoading: boolean;
  error: string | null;
  createThread: () => Promise<Thread>;
  getThread: (threadId: string) => Promise<Thread | null>;
  sendMessage: (content: string) => Promise<void>;
  getAllThreads: () => Promise<Thread[]>;
  setActiveThread: (threadId: string) => void;
  toggleExpanded: () => void;
  executeTask: (task: Task) => Promise<boolean>;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

export const AIAssistantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuthContext();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThread, setActiveThreadState] = useState<Thread | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch threads when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      getAllThreads().catch(console.error);
    }
  }, [isAuthenticated, user]);

  const createThread = useCallback(async (): Promise<Thread> => {
    if (!isAuthenticated || !user) {
      throw new Error('You must be logged in to create a thread');
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
          title: 'New Conversation',
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
  }, [isAuthenticated, user]);

  const getThread = useCallback(
    async (threadId: string): Promise<Thread | null> => {
      if (!isAuthenticated || !user) {
        throw new Error('You must be logged in to get thread details');
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
      if (!isAuthenticated || !user) {
        throw new Error('You must be logged in to send a message');
      }

      if (!activeThread) {
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

        // Update the UI optimistically
        const updatedThread = {
          ...activeThread,
          messages: [...activeThread.messages, tempMessage],
          updatedAt: new Date().toISOString(),
        };
        setActiveThreadState(updatedThread);

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
    (threadId: string) => {
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
