import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db';
import { authenticate, isAdmin } from '../middleware/auth';
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
const OPENAI_ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID || 'asst_Le5hAPkk1mriAIVsRK06qGsm';

// Check if OpenAI API key is configured
const isOpenAIConfigured = !!OPENAI_API_KEY;
console.log(`OpenAI API ${isOpenAIConfigured ? 'is configured' : 'is NOT configured'}`);
console.log(`Using Assistant ID: ${OPENAI_ASSISTANT_ID}`);

// Get all threads for the authenticated user
router.get('/threads', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!db.data.aiThreads) {
      db.data.aiThreads = [];
    }

    const userThreads = db.data.aiThreads.filter(
      (thread: Thread) => thread.userId === req.user?.id
    );

    // Sort by most recent update
    userThreads.sort(
      (a: Thread, b: Thread) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    // Return threads with limited message preview (just the last 2 messages)
    const threadsWithPreview = userThreads.map((thread: Thread) => ({
      ...thread,
      messages: thread.messages.slice(-2),
    }));

    res.json(threadsWithPreview);
  } catch (error) {
    console.error('Error fetching threads:', error);
    res.status(500).json({ error: 'Server error while fetching threads' });
  }
});

// Get a specific thread
router.get('/threads/:threadId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const thread = db.data.aiThreads.find(
      (thread: Thread) => thread.id === req.params.threadId && thread.userId === req.user?.id
    );

    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    res.json(thread);
  } catch (error) {
    console.error('Error fetching thread:', error);
    res.status(500).json({ error: 'Server error while fetching thread' });
  }
});

// Create a new thread
router.post('/threads', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { title = 'New Conversation' } = req.body;

    const newThread: Thread = {
      id: uuidv4(),
      userId: req.user?.id || '',
      title,
      messages: [
        {
          id: uuidv4(),
          role: 'system',
          content:
            'I am an AI assistant for Southwest Vacations. I can help you find destinations, answer questions about bookings, and provide travel recommendations.',
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Initialize aiThreads array if it doesn't exist
    if (!db.data.aiThreads) {
      db.data.aiThreads = [];
    }

    db.data.aiThreads.push(newThread);
    await db.write();

    res.status(201).json(newThread);
  } catch (error) {
    console.error('Error creating thread:', error);
    res.status(500).json({ error: 'Server error while creating thread' });
  }
});

// Send a message to a thread and get AI response
router.post(
  '/threads/:threadId/messages',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { content } = req.body;
      if (!content || content.trim() === '') {
        return res.status(400).json({ error: 'Message content is required' });
      }

      // Find the thread
      const threadIndex = db.data.aiThreads.findIndex(
        (thread: Thread) => thread.id === req.params.threadId && thread.userId === req.user?.id
      );

      if (threadIndex === -1) {
        return res.status(404).json({ error: 'Thread not found' });
      }

      const thread = db.data.aiThreads[threadIndex];

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
          // Try to get a response from OpenAI
          aiResponse = await generateOpenAIResponse(thread, content);
        } catch (openAIError) {
          console.error('Error with OpenAI:', openAIError);
          // Fallback to mock response if OpenAI fails
          aiResponse = await generateMockAIResponse(thread, content);
        }
      } else {
        // Use mock response if OpenAI is not configured
        aiResponse = await generateMockAIResponse(thread, content);
      }

      thread.messages.push(aiResponse);

      // Update the thread in the database
      db.data.aiThreads[threadIndex] = thread;
      await db.write();

      res.json(thread);
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Server error while sending message' });
    }
  }
);

// Admin routes

// Get all threads (admin only)
router.get('/admin/threads', authenticate, isAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    // Initialize aiThreads array if it doesn't exist
    if (!db.data.aiThreads) {
      db.data.aiThreads = [];
    }

    const allThreads = db.data.aiThreads;

    // Sort by most recent update
    allThreads.sort(
      (a: Thread, b: Thread) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    // Return threads with limited message preview
    const threadsWithPreview = allThreads.map((thread: Thread) => ({
      ...thread,
      messages: thread.messages.slice(-1),
    }));

    res.json(threadsWithPreview);
  } catch (error) {
    console.error('Error fetching all threads:', error);
    res.status(500).json({ error: 'Server error while fetching threads' });
  }
});

// Get a specific thread (admin access)
router.get(
  '/admin/threads/:threadId',
  authenticate,
  isAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const thread = db.data.aiThreads.find((thread: Thread) => thread.id === req.params.threadId);

      if (!thread) {
        return res.status(404).json({ error: 'Thread not found' });
      }

      res.json(thread);
    } catch (error) {
      console.error('Error fetching thread:', error);
      res.status(500).json({ error: 'Server error while fetching thread' });
    }
  }
);

// Helper function to send request to OpenAI API
async function generateOpenAIResponse(thread: Thread, userMessage: string): Promise<Message> {
  try {
    console.log('Generating OpenAI response using Assistant:', OPENAI_ASSISTANT_ID);

    // In a real implementation, this would call the OpenAI API with assistant ID
    // For now, we'll simulate the API call but use our mock responses

    // Simulate an API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return generateMockAIResponse(thread, userMessage);
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

// Helper function to generate AI response (mock implementation)
async function generateMockAIResponse(thread: Thread, userMessage: string): Promise<Message> {
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
  } else if (lowercaseMessage.includes('cancel')) {
    jsonResponse.message =
      'For cancellation inquiries, I need to know more about your booking. Do you have a confirmation number?';
    jsonResponse.suggestions = [
      'What is your cancellation policy?',
      'Can I get a refund?',
      'How do I cancel only part of my reservation?',
    ];
  } else if (lowercaseMessage.includes('price') || lowercaseMessage.includes('cost')) {
    jsonResponse.message =
      'Prices vary based on destination, dates, and accommodations. Could you provide more details about your planned trip so I can give you accurate information?';
    jsonResponse.suggestions = [
      'What affects the price of flights?',
      'Do you offer price matching?',
      'Are there any current promotions?',
    ];
  } else if (lowercaseMessage.includes('hawaii')) {
    jsonResponse.message =
      'Hawaii is one of our most popular destinations! We have packages available for Oahu, Maui, Kauai, and the Big Island. Which island interests you the most?';
    jsonResponse.suggestions = [
      'Tell me about Maui packages',
      'What activities are available in Hawaii?',
      'When is the best time to visit Hawaii?',
    ];
  } else if (lowercaseMessage.includes('thank')) {
    jsonResponse.message = "You're welcome! Is there anything else I can help you with today?";
    jsonResponse.suggestions = [
      'Yes, I have another question',
      "No, that's all for now",
      'Tell me about special offers',
    ];
  } else if (lowercaseMessage.includes('test')) {
    jsonResponse.message =
      'I see this is a test message. I have received it successfully and am responding as expected.';
    jsonResponse.suggestions = [
      'Test another feature',
      'Show me what else you can do',
      'How do I use the assistant?',
    ];
  } else if (
    lowercaseMessage.includes('ability') ||
    lowercaseMessage.includes('abilities') ||
    lowercaseMessage.includes('can you do')
  ) {
    jsonResponse.message =
      'I can help you with various Southwest Vacations services including booking flights, hotels, and car rentals. I can provide information about destinations, answer questions about your reservations, and guide you through the checkout process.';
    jsonResponse.suggestions = [
      'Tell me about popular destinations',
      'How do I book a flight?',
      'What deals are available now?',
    ];
  } else if (lowercaseMessage.includes('json')) {
    jsonResponse.message =
      'I can provide responses in JSON format. This structured format helps with displaying information in a consistent way.';
    jsonResponse.suggestions = [
      'What other formats can you support?',
      'How do I use JSON responses?',
      'Show me an example',
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
