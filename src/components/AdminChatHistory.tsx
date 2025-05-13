import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Thread, Message } from '../context/AIAssistantContext';

const AdminChatHistory: React.FC = () => {
  const { users } = useAdmin();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterUserId, setFilterUserId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch all chat threads on component mount
  useEffect(() => {
    const fetchAllThreads = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/admin/ai/threads', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch chat history');
        }

        const threadsData = await response.json();
        setThreads(threadsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching chat history:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllThreads();
  }, []);

  // Filter threads based on selected user and search term
  const filteredThreads = threads.filter(thread => {
    // Filter by user if a specific user is selected
    const userMatch = filterUserId === 'all' || thread.userId === filterUserId;

    // Filter by search term if provided
    const searchMatch =
      searchTerm === '' ||
      thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.messages.some(message =>
        message.content.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return userMatch && searchMatch;
  });

  const fetchThreadDetails = async (threadId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/ai/threads/${threadId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch thread details');
      }

      const threadData = await response.json();
      setSelectedThread(threadData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching thread details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Find username for a given user ID
  const getUsernameById = (userId: string): string => {
    const user = users.find(user => user.id === userId);
    return user ? user.username : 'Unknown User';
  };

  return (
    <div className="rounded-lg bg-white shadow-md">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-medium">Chat History</h2>
        <p className="mt-1 text-sm text-gray-500">
          View and analyze all AI assistant conversations
        </p>
      </div>

      {/* Filters */}
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="user-filter" className="mb-1 block text-sm font-medium text-gray-700">
              Filter by User
            </label>
            <select
              id="user-filter"
              value={filterUserId}
              onChange={e => setFilterUserId(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">All Users</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="search-term" className="mb-1 block text-sm font-medium text-gray-700">
              Search Conversations
            </label>
            <input
              type="text"
              id="search-term"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by keyword..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="border-b border-red-200 bg-red-50 p-4 text-red-700">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Content */}
      <div className="grid h-[600px] grid-cols-1 md:grid-cols-3">
        {/* Thread list */}
        <div className="h-full overflow-y-auto border-r border-gray-200">
          {isLoading && !selectedThread ? (
            <div className="p-4 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-gray-500">Loading conversations...</p>
            </div>
          ) : filteredThreads.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No conversations found</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredThreads.map(thread => (
                <li
                  key={thread.id}
                  onClick={() => fetchThreadDetails(thread.id)}
                  className={`cursor-pointer hover:bg-gray-50 ${
                    selectedThread?.id === thread.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="p-4">
                    <div className="flex justify-between">
                      <h3 className="max-w-[70%] truncate font-medium text-gray-900">
                        {thread.title}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {new Date(thread.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-gray-500">
                      User: {getUsernameById(thread.userId)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">{thread.messages.length} messages</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Thread detail view */}
        <div className="col-span-2 flex h-full flex-col">
          {!selectedThread ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              <p>Select a conversation to view details</p>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="border-b border-gray-200 bg-gray-50 p-4">
                <h3 className="font-medium text-gray-900">{selectedThread.title}</h3>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    User: {getUsernameById(selectedThread.userId)}
                  </p>
                  <div className="text-xs text-gray-500">
                    Created: {new Date(selectedThread.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Thread messages */}
              <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                  <div className="p-4 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-2 text-gray-500">Loading messages...</p>
                  </div>
                ) : selectedThread.messages.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No messages in this conversation
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedThread.messages.map((message: Message) => (
                      <MessageItem key={message.id} message={message} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isSystem
            ? 'border border-gray-200 bg-gray-100 text-gray-700'
            : isUser
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800'
        }`}
      >
        <div className="mb-1 text-xs font-medium">
          {isSystem ? 'System' : isUser ? 'User' : 'AI Assistant'}
        </div>
        <p className="whitespace-pre-wrap">{message.content}</p>
        <div
          className="mt-2 text-right text-xs"
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

export default AdminChatHistory;
