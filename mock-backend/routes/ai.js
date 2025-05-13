import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

// Get OpenAI configuration from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID || 'asst_Le5hAPkk1mriAIVsRK06qGsm';

// Check if OpenAI API key is configured
const isOpenAIConfigured = !!OPENAI_API_KEY;
console.log(`OpenAI API ${isOpenAIConfigured ? 'is configured' : 'is NOT configured'}`);
console.log(`Using Assistant ID: ${OPENAI_ASSISTANT_ID}`);

// Get all threads for the authenticated user
router.get('/threads', authenticate, async (req, res) => {
  try {
    const userThreads = db.data.aiThreads.filter(thread => thread.userId === req.user.id);
    
    // Sort by most recent update
    userThreads.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    // Return threads with limited message preview (just the last 2 messages)
    const threadsWithPreview = userThreads.map(thread => ({
      ...thread,
      messages: thread.messages.slice(-2)
    }));
    
    res.json(threadsWithPreview);
  } catch (error) {
    console.error('Error fetching threads:', error);
    res.status(500).json({ error: 'Server error while fetching threads' });
  }
});

// Get a specific thread
router.get('/threads/:threadId', authenticate, async (req, res) => {
  try {
    const thread = db.data.aiThreads.find(
      thread => thread.id === req.params.threadId && thread.userId === req.user.id
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
router.post('/threads', authenticate, async (req, res) => {
  try {
    const { title = 'New Conversation' } = req.body;
    
    const newThread = {
      id: uuidv4(),
      userId: req.user.id,
      title,
      messages: [
        {
          id: uuidv4(),
          role: 'system',
          content: 'I am an AI assistant for Southwest Vacations. I can help you find destinations, answer questions about bookings, and provide travel recommendations.',
          createdAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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
router.post('/threads/:threadId/messages', authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Message content is required' });
    }

    // Find the thread
    const threadIndex = db.data.aiThreads.findIndex(
      thread => thread.id === req.params.threadId && thread.userId === req.user.id
    );

    if (threadIndex === -1) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    const thread = db.data.aiThreads[threadIndex];

    // Add user message
    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content,
      createdAt: new Date().toISOString()
    };
    
    thread.messages.push(userMessage);
    thread.updatedAt = new Date().toISOString();

    // Generate AI response
    let aiResponse;
    
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
});

// Admin routes

// Get all threads (admin only)
router.get('/admin/threads', authenticate, isAdmin, async (req, res) => {
  try {
    // Initialize aiThreads array if it doesn't exist
    if (!db.data.aiThreads) {
      db.data.aiThreads = [];
    }
    
    const allThreads = db.data.aiThreads;
    
    // Sort by most recent update
    allThreads.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    // Return threads with limited message preview
    const threadsWithPreview = allThreads.map(thread => ({
      ...thread,
      messages: thread.messages.slice(-1)
    }));
    
    res.json(threadsWithPreview);
  } catch (error) {
    console.error('Error fetching all threads:', error);
    res.status(500).json({ error: 'Server error while fetching threads' });
  }
});

// Get a specific thread (admin access)
router.get('/admin/threads/:threadId', authenticate, isAdmin, async (req, res) => {
  try {
    const thread = db.data.aiThreads.find(thread => thread.id === req.params.threadId);

    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    res.json(thread);
  } catch (error) {
    console.error('Error fetching thread:', error);
    res.status(500).json({ error: 'Server error while fetching thread' });
  }
});

// Helper function to send request to OpenAI API
async function generateOpenAIResponse(thread, userMessage) {
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
async function generateMockAIResponse(thread, userMessage) {
  // Simple responses based on user input
  let responseContent = '';
  const lowercaseMessage = userMessage.toLowerCase();
  
  if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi')) {
    responseContent = 'Hello! How can I help you with your Southwest Vacations plans today?';
  } else if (lowercaseMessage.includes('booking') || lowercaseMessage.includes('reservation')) {
    responseContent = 'I can help you with your booking. What specific information do you need about your reservation?';
  } else if (lowercaseMessage.includes('flight') || lowercaseMessage.includes('flights')) {
    responseContent = 'Southwest Airlines offers flights to many destinations. When are you planning to travel and where would you like to go?';
  } else if (lowercaseMessage.includes('hotel') || lowercaseMessage.includes('accommodation')) {
    responseContent = 'We have partnered with many quality hotels. What destination are you interested in, and what amenities are most important to you?';
  } else if (lowercaseMessage.includes('cancel')) {
    responseContent = 'For cancellation inquiries, I need to know more about your booking. Do you have a confirmation number?';
  } else if (lowercaseMessage.includes('price') || lowercaseMessage.includes('cost')) {
    responseContent = 'Prices vary based on destination, dates, and accommodations. Could you provide more details about your planned trip so I can give you accurate information?';
  } else if (lowercaseMessage.includes('hawaii')) {
    responseContent = 'Hawaii is one of our most popular destinations! We have packages available for Oahu, Maui, Kauai, and the Big Island. Which island interests you the most?';
  } else if (lowercaseMessage.includes('thank')) {
    responseContent = 'You\'re welcome! Is there anything else I can help you with today?';
  } else if (lowercaseMessage.includes('test')) {
    responseContent = 'I see this is a test message. I have received it successfully and am responding as expected.';
  } else {
    responseContent = 'Thank you for your message. How else can I assist you with your Southwest Vacations experience?';
  }
  
  // Create the AI message
  return {
    id: uuidv4(),
    role: 'assistant',
    content: responseContent,
    createdAt: new Date().toISOString()
  };
}

export default router; 