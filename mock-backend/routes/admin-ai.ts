import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

// Define interface for thread and message
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

interface Thread {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

// Extend Request type to include user
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Get OpenAI configuration from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ADMIN_OPENAI_ASSISTANT_ID =
  process.env.ADMIN_OPENAI_ASSISTANT_ID || 'asst_hoKSs6GmjhQWSsvZPVvc3Qqv';

// Check if OpenAI API key is configured
const isOpenAIConfigured = !!OPENAI_API_KEY;
console.log(`OpenAI API for Admin ${isOpenAIConfigured ? 'is configured' : 'is NOT configured'}`);
console.log(`Using Admin Assistant ID: ${ADMIN_OPENAI_ASSISTANT_ID}`);

// Get all admin assistant threads for the authenticated admin
router.get('/ai/admin-threads', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    if (!db.data.adminAiThreads) {
      db.data.adminAiThreads = [];
    }

    const adminThreads = db.data.adminAiThreads.filter(
      (thread: Thread) => thread.userId === req.user?.id
    );

    // Sort by most recent update
    adminThreads.sort(
      (a: Thread, b: Thread) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    // Return threads with limited message preview (just the last 2 messages)
    const threadsWithPreview = adminThreads.map((thread: Thread) => ({
      ...thread,
      messages: thread.messages.slice(-2),
    }));

    res.json(threadsWithPreview);
  } catch (error) {
    console.error('Error fetching admin threads:', error);
    res.status(500).json({ error: 'Server error while fetching admin threads' });
  }
});

// Get a specific admin assistant thread
router.get(
  '/ai/admin-threads/:threadId',
  authenticate,
  isAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const thread = db.data.adminAiThreads?.find(
        (thread: Thread) => thread.id === req.params.threadId && thread.userId === req.user?.id
      );

      if (!thread) {
        return res.status(404).json({ error: 'Admin thread not found' });
      }

      res.json(thread);
    } catch (error) {
      console.error('Error fetching admin thread:', error);
      res.status(500).json({ error: 'Server error while fetching admin thread' });
    }
  }
);

// Create a new admin assistant thread
router.post('/ai/admin-threads', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { title = 'New Admin Conversation' } = req.body;

    const newThread: Thread = {
      id: uuidv4(),
      userId: req.user?.id || '',
      title,
      messages: [
        {
          id: uuidv4(),
          role: 'system',
          content:
            'I am an AI assistant for Southwest Vacations administrators. I can help you analyze user data, manage bookings, and provide advanced system insights that regular users cannot access.',
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Initialize adminAiThreads array if it doesn't exist
    if (!db.data.adminAiThreads) {
      db.data.adminAiThreads = [];
    }

    db.data.adminAiThreads.push(newThread);
    await db.write();

    res.status(201).json(newThread);
  } catch (error) {
    console.error('Error creating admin thread:', error);
    res.status(500).json({ error: 'Server error while creating admin thread' });
  }
});

// Send a message to an admin thread and get AI response
router.post(
  '/ai/admin-threads/:threadId/messages',
  authenticate,
  isAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { content } = req.body;
      if (!content || content.trim() === '') {
        return res.status(400).json({ error: 'Message content is required' });
      }

      // Find the thread
      const threadIndex = db.data.adminAiThreads?.findIndex(
        (thread: Thread) => thread.id === req.params.threadId && thread.userId === req.user?.id
      );

      if (threadIndex === -1 || threadIndex === undefined) {
        return res.status(404).json({ error: 'Admin thread not found' });
      }

      const thread = db.data.adminAiThreads[threadIndex];

      // Add user message
      const userMessage: Message = {
        id: uuidv4(),
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
      };

      thread.messages.push(userMessage);
      thread.updatedAt = new Date().toISOString();

      // Generate AI response
      let aiResponse: Message;

      if (isOpenAIConfigured) {
        try {
          // Try to get a response from OpenAI using the admin assistant
          aiResponse = await generateAdminOpenAIResponse(thread, content);
        } catch (openAIError) {
          console.error('Error with Admin OpenAI:', openAIError);
          // Fallback to mock response if OpenAI fails
          aiResponse = await generateAdminMockAIResponse(thread, content);
        }
      } else {
        // Use mock response if OpenAI is not configured
        aiResponse = await generateAdminMockAIResponse(thread, content);
      }

      thread.messages.push(aiResponse);

      // Update the thread in the database
      db.data.adminAiThreads[threadIndex] = thread;
      await db.write();

      res.json(thread);
    } catch (error) {
      console.error('Error sending message to admin thread:', error);
      res.status(500).json({ error: 'Server error while sending message to admin thread' });
    }
  }
);

// Helper function to send request to OpenAI API for admin assistant
async function generateAdminOpenAIResponse(thread: Thread, userMessage: string): Promise<Message> {
  try {
    console.log('Generating Admin OpenAI response using Assistant:', ADMIN_OPENAI_ASSISTANT_ID);

    // In a real implementation, this would call the OpenAI API with the admin assistant ID
    // For now, we'll simulate the API call but use our mock responses

    // Simulate an API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return generateAdminMockAIResponse(thread, userMessage);
  } catch (error) {
    console.error('Admin OpenAI API error:', error);
    throw error;
  }
}

// Helper function to generate admin AI response (mock implementation)
async function generateAdminMockAIResponse(thread: Thread, userMessage: string): Promise<Message> {
  // Simple responses based on user input
  let responseContent = '';
  const lowercaseMessage = userMessage.toLowerCase();

  // Create response object
  const jsonResponse = {
    message: '',
    suggestions: [] as string[],
    status: 'success' as 'success' | 'error',
    timestamp: new Date().toISOString(),
  };

  if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi')) {
    jsonResponse.message =
      'Hello admin! How can I assist you with Southwest Vacations administrative tasks today?';
    jsonResponse.suggestions = [
      'Show me user analytics',
      'Help me manage bookings',
      'Check system status',
    ];
  } else if (lowercaseMessage.includes('analytics') || lowercaseMessage.includes('data')) {
    jsonResponse.message =
      'I can help you analyze user data. What specific metrics would you like to see?';
    jsonResponse.suggestions = [
      'Booking conversion rates',
      'Popular destinations this month',
      'User engagement statistics',
    ];
  } else if (lowercaseMessage.includes('booking') || lowercaseMessage.includes('reservation')) {
    jsonResponse.message =
      'As an admin, you have full access to booking management. What would you like to do with bookings?';
    jsonResponse.suggestions = [
      "Find a user's booking",
      'Modify booking status',
      'Check for conflicting bookings',
    ];
  } else if (lowercaseMessage.includes('user') || lowercaseMessage.includes('customer')) {
    jsonResponse.message =
      'You can access user information and manage user accounts. What user-related task do you need help with?';
    jsonResponse.suggestions = [
      'Find a user by email',
      'Check user booking history',
      'Review user AI conversations',
    ];
  } else if (lowercaseMessage.includes('system') || lowercaseMessage.includes('status')) {
    jsonResponse.message =
      'I can help you monitor system status and performance. What aspect of the system would you like to check?';
    jsonResponse.suggestions = ['API response times', 'Error rates', 'Database status'];
  } else if (lowercaseMessage.includes('ai') || lowercaseMessage.includes('assistant')) {
    jsonResponse.message =
      'As an admin, you have access to AI assistant analytics and configuration. What would you like to know?';
    jsonResponse.suggestions = [
      'Most common user questions',
      'AI performance metrics',
      'Update AI response templates',
    ];
  } else if (lowercaseMessage.includes('review') || lowercaseMessage.includes('conversation')) {
    jsonResponse.message =
      'I can help you review user conversations with the AI assistant. Would you like to see specific conversation analytics or find particular interactions?';
    jsonResponse.suggestions = [
      'Show me confused users',
      'Find conversations about cancellations',
      'Analyze sentiment in conversations',
    ];
  } else {
    jsonResponse.message =
      'As an admin assistant, I can provide detailed insights and advanced functionalities not available to regular users. How can I help you manage Southwest Vacations today?';
    jsonResponse.suggestions = [
      'Show me system analytics',
      'Help me manage users',
      'Access booking controls',
    ];
  }

  // Serialize the JSON response
  responseContent = JSON.stringify(jsonResponse, null, 2);

  // Create the AI message
  return {
    id: uuidv4(),
    role: 'assistant',
    content: responseContent,
    createdAt: new Date().toISOString(),
  };
}

export default router;
