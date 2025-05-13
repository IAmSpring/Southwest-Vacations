import express, { Response } from 'express';
import db from '../db';
import { authenticate, isAdmin } from '../middleware/auth';

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
interface AuthRequest extends express.Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const router = express.Router();

// Get all threads (admin only)
router.get('/ai/threads', authenticate, isAdmin, async (_req: AuthRequest, res: Response) => {
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
  '/ai/threads/:threadId',
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

export default router;
