import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// In-memory tickets store
let tickets = [
  {
    id: 'ticket-1',
    userId: 'user1',
    title: 'Flight cancellation refund',
    description: 'My flight was cancelled but I haven\'t received a refund yet. Booking reference: SWV12345',
    status: 'open', // open, in-progress, resolved, closed
    priority: 'high', // low, medium, high, urgent
    category: 'refund',
    createdAt: new Date('2023-12-01T10:15:30Z').toISOString(),
    updatedAt: new Date('2023-12-01T10:15:30Z').toISOString(),
    assignedTo: 'ai-agent', // ai-agent, human-agent-1, etc.
    isAIHandled: true,
    attachments: [],
    responses: [
      {
        id: 'response-1',
        ticketId: 'ticket-1',
        content: 'We are reviewing your refund status and will update you within 24 hours.',
        createdAt: new Date('2023-12-01T11:35:20Z').toISOString(),
        responder: 'ai-agent',
        isAIGenerated: true
      }
    ]
  },
  {
    id: 'ticket-2',
    userId: 'user1',
    title: 'Need to change my booking dates',
    description: 'I need to postpone my trip by two weeks. Booking reference: SWV23456',
    status: 'in-progress',
    priority: 'medium',
    category: 'booking_change',
    createdAt: new Date('2023-12-03T14:20:15Z').toISOString(),
    updatedAt: new Date('2023-12-03T15:45:10Z').toISOString(),
    assignedTo: 'human-agent-1',
    isAIHandled: false,
    attachments: [],
    responses: [
      {
        id: 'response-2',
        ticketId: 'ticket-2',
        content: "I've reviewed your request. To proceed with changing your dates, we'll need to check availability. Could you please let me know which new dates you're considering?",
        createdAt: new Date('2023-12-03T15:45:10Z').toISOString(),
        responder: 'human-agent-1',
        isAIGenerated: false
      },
      {
        id: 'response-3',
        ticketId: 'ticket-2',
        content: "I'd like to change to December 24-31 if possible.",
        createdAt: new Date('2023-12-03T16:20:30Z').toISOString(),
        responder: 'user1',
        isAIGenerated: false
      }
    ]
  },
  {
    id: 'ticket-3',
    userId: 'user2',
    title: 'Missing loyalty points from last booking',
    description: 'I didn\'t receive my loyalty points for my last booking (SWV34567).',
    status: 'resolved',
    priority: 'low',
    category: 'loyalty_program',
    createdAt: new Date('2023-11-28T09:10:05Z').toISOString(),
    updatedAt: new Date('2023-11-29T11:30:25Z').toISOString(),
    assignedTo: 'ai-agent',
    isAIHandled: true,
    attachments: [],
    responses: [
      {
        id: 'response-4',
        ticketId: 'ticket-3',
        content: "I've checked your account and confirmed that the points were not credited. I've added 2,500 points to your account, which should reflect within 24 hours.",
        createdAt: new Date('2023-11-28T10:05:15Z').toISOString(),
        responder: 'ai-agent',
        isAIGenerated: true
      },
      {
        id: 'response-5',
        ticketId: 'ticket-3',
        content: 'Thank you for resolving this so quickly!',
        createdAt: new Date('2023-11-28T14:30:00Z').toISOString(),
        responder: 'user2',
        isAIGenerated: false
      },
      {
        id: 'response-6',
        ticketId: 'ticket-3',
        content: "You're welcome! The points have been credited to your account. Is there anything else you need assistance with?",
        createdAt: new Date('2023-11-29T11:30:25Z').toISOString(),
        responder: 'ai-agent',
        isAIGenerated: true
      }
    ]
  },
  {
    id: 'ticket-4',
    userId: 'user3',
    title: 'Special meal request',
    description: 'I need to request vegetarian meals for my upcoming flight.',
    status: 'open',
    priority: 'medium',
    category: 'special_request',
    createdAt: new Date('2023-12-04T08:15:30Z').toISOString(),
    updatedAt: new Date('2023-12-04T08:15:30Z').toISOString(),
    assignedTo: null,
    isAIHandled: false,
    attachments: [],
    responses: []
  },
  {
    id: 'ticket-5',
    userId: 'user1',
    title: 'Billing discrepancy',
    description: 'I was charged twice for my booking (SWV12345). Please refund the duplicate charge.',
    status: 'in-progress',
    priority: 'urgent',
    category: 'billing',
    createdAt: new Date('2023-12-02T16:45:20Z').toISOString(),
    updatedAt: new Date('2023-12-02T17:30:10Z').toISOString(),
    assignedTo: 'human-agent-2',
    isAIHandled: false,
    attachments: [
      {
        id: 'attachment-1',
        fileName: 'billing_statement.pdf',
        fileType: 'application/pdf',
        fileSize: 1250000,
        uploadedAt: new Date('2023-12-02T16:45:20Z').toISOString()
      }
    ],
    responses: [
      {
        id: 'response-7',
        ticketId: 'ticket-5',
        content: "Thank you for bringing this to our attention. I can see the duplicate charge in our system. I've initiated a refund which should appear on your account within 3-5 business days.",
        createdAt: new Date('2023-12-02T17:30:10Z').toISOString(),
        responder: 'human-agent-2',
        isAIGenerated: false
      }
    ]
  },
  {
    id: 'ticket-6',
    userId: 'user4',
    title: 'Website technical issue',
    description: 'I can\'t complete my booking. The site keeps showing an error at the payment step.',
    status: 'closed',
    priority: 'high',
    category: 'technical',
    createdAt: new Date('2023-11-20T13:25:15Z').toISOString(),
    updatedAt: new Date('2023-11-21T15:40:30Z').toISOString(),
    assignedTo: 'ai-agent',
    isAIHandled: true,
    attachments: [
      {
        id: 'attachment-2',
        fileName: 'error_screenshot.png',
        fileType: 'image/png',
        fileSize: 840000,
        uploadedAt: new Date('2023-11-20T13:25:15Z').toISOString()
      }
    ],
    responses: [
      {
        id: 'response-8',
        ticketId: 'ticket-6',
        content: "I apologize for the inconvenience. We're experiencing some temporary payment processing issues. Our team is working on it. Could you please try again in about 30 minutes?",
        createdAt: new Date('2023-11-20T13:40:25Z').toISOString(),
        responder: 'ai-agent',
        isAIGenerated: true
      },
      {
        id: 'response-9',
        ticketId: 'ticket-6',
        content: 'I tried again and it worked! Thanks.',
        createdAt: new Date('2023-11-20T14:30:15Z').toISOString(),
        responder: 'user4',
        isAIGenerated: false
      },
      {
        id: 'response-10',
        ticketId: 'ticket-6',
        content: "Great! I'm glad to hear it's working now. If you encounter any other issues, please let us know.",
        createdAt: new Date('2023-11-20T14:45:20Z').toISOString(),
        responder: 'ai-agent',
        isAIGenerated: true
      }
    ]
  },
  {
    id: 'ticket-7',
    userId: 'user5',
    title: 'Travel insurance inquiry',
    description: 'What travel insurance options are available for my upcoming trip to Hawaii?',
    status: 'in-progress',
    priority: 'low',
    category: 'insurance',
    createdAt: new Date('2023-12-05T09:15:10Z').toISOString(),
    updatedAt: new Date('2023-12-05T09:30:45Z').toISOString(),
    assignedTo: 'ai-agent',
    isAIHandled: true,
    attachments: [],
    responses: [
      {
        id: 'response-11',
        ticketId: 'ticket-7',
        content: 'We offer several travel insurance options for Hawaii trips, including basic, premium, and comprehensive coverage. Would you like me to explain the benefits of each plan?',
        createdAt: new Date('2023-12-05T09:30:45Z').toISOString(),
        responder: 'ai-agent',
        isAIGenerated: true
      }
    ]
  },
  {
    id: 'ticket-8',
    userId: 'user6',
    title: 'Airport transfer information',
    description: 'How do I arrange airport transfers for my upcoming trip to Cancun?',
    status: 'resolved',
    priority: 'medium',
    category: 'transfers',
    createdAt: new Date('2023-11-30T11:20:35Z').toISOString(),
    updatedAt: new Date('2023-12-01T12:15:40Z').toISOString(),
    assignedTo: 'human-agent-3',
    isAIHandled: false,
    attachments: [],
    responses: [
      {
        id: 'response-12',
        ticketId: 'ticket-8',
        content: 'Airport transfers in Cancun can be booked through our website or by calling our customer service. For your specific booking, I recommend the private shuttle service which costs $45 each way. Would you like me to add this to your booking?',
        createdAt: new Date('2023-11-30T12:10:25Z').toISOString(),
        responder: 'human-agent-3',
        isAIGenerated: false
      },
      {
        id: 'response-13',
        ticketId: 'ticket-8',
        content: 'Yes, please add the private shuttle to my booking.',
        createdAt: new Date('2023-11-30T16:05:30Z').toISOString(),
        responder: 'user6',
        isAIGenerated: false
      },
      {
        id: 'response-14',
        ticketId: 'ticket-8',
        content: "I've added the private shuttle service to your booking. You'll receive a confirmation email with the details within the next hour.",
        createdAt: new Date('2023-12-01T12:15:40Z').toISOString(),
        responder: 'human-agent-3',
        isAIGenerated: false
      }
    ]
  },
  {
    id: 'ticket-9',
    userId: 'user7',
    title: 'Car rental add-on',
    description: "I'd like to add a car rental to my Las Vegas trip booking (SWV45678).",
    status: 'closed',
    priority: 'medium',
    category: 'booking_add_on',
    createdAt: new Date('2023-11-15T10:30:20Z').toISOString(),
    updatedAt: new Date('2023-11-16T14:20:35Z').toISOString(),
    assignedTo: 'ai-agent',
    isAIHandled: true,
    attachments: [],
    responses: [
      {
        id: 'response-15',
        ticketId: 'ticket-9',
        content: "I'd be happy to help you add a car rental to your booking. We have economy, mid-size, and luxury options available. Which would you prefer?",
        createdAt: new Date('2023-11-15T10:45:15Z').toISOString(),
        responder: 'ai-agent',
        isAIGenerated: true
      },
      {
        id: 'response-16',
        ticketId: 'ticket-9',
        content: "I'd like the mid-size option please.",
        createdAt: new Date('2023-11-15T11:20:10Z').toISOString(),
        responder: 'user7',
        isAIGenerated: false
      },
      {
        id: 'response-17',
        ticketId: 'ticket-9',
        content: "I've added a mid-size car rental to your booking. The additional cost is $179 for your stay duration. This has been added to your overall booking and you can view the updated details in your account.",
        createdAt: new Date('2023-11-15T11:35:25Z').toISOString(),
        responder: 'ai-agent',
        isAIGenerated: true
      },
      {
        id: 'response-18',
        ticketId: 'ticket-9',
        content: 'Thank you! That looks perfect.',
        createdAt: new Date('2023-11-16T09:05:40Z').toISOString(),
        responder: 'user7',
        isAIGenerated: false
      }
    ]
  },
  {
    id: 'ticket-10',
    userId: 'user2',
    title: 'How to check in online',
    description: 'I can\'t figure out how to check in online for my flight tomorrow.',
    status: 'open',
    priority: 'high',
    category: 'online_check_in',
    createdAt: new Date('2023-12-05T18:10:30Z').toISOString(),
    updatedAt: new Date('2023-12-05T18:10:30Z').toISOString(),
    assignedTo: null,
    isAIHandled: false,
    attachments: [],
    responses: []
  }
];

// Get all tickets (with optional filtering)
router.get('/', authenticate, (req, res) => {
  const { status, priority, category, isAIHandled } = req.query;
  let filteredTickets = [...tickets];
  
  // Apply filters if provided
  if (status) {
    filteredTickets = filteredTickets.filter(ticket => ticket.status === status);
  }
  
  if (priority) {
    filteredTickets = filteredTickets.filter(ticket => ticket.priority === priority);
  }
  
  if (category) {
    filteredTickets = filteredTickets.filter(ticket => ticket.category === category);
  }
  
  if (isAIHandled !== undefined) {
    const aiHandled = isAIHandled === 'true';
    filteredTickets = filteredTickets.filter(ticket => ticket.isAIHandled === aiHandled);
  }
  
  res.json(filteredTickets);
});

// Get ticket by ID
router.get('/:id', authenticate, (req, res) => {
  const ticket = tickets.find(t => t.id === req.params.id);
  
  if (!ticket) {
    return res.status(404).json({ message: 'Ticket not found' });
  }
  
  res.json(ticket);
});

// Create new ticket
router.post('/', authenticate, (req, res) => {
  const { title, description, category, priority = 'medium' } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }
  
  const newTicket = {
    id: `ticket-${uuidv4()}`,
    userId: req.user.id,
    title,
    description,
    status: 'open',
    priority,
    category: category || 'general',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignedTo: null,
    isAIHandled: Math.random() > 0.5, // 50% chance of being AI handled
    attachments: [],
    responses: []
  };
  
  tickets.push(newTicket);
  res.status(201).json(newTicket);
});

// Update ticket
router.put('/:id', authenticate, (req, res) => {
  const ticketIndex = tickets.findIndex(t => t.id === req.params.id);
  
  if (ticketIndex === -1) {
    return res.status(404).json({ message: 'Ticket not found' });
  }
  
  const updatedTicket = {
    ...tickets[ticketIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  tickets[ticketIndex] = updatedTicket;
  res.json(updatedTicket);
});

// Add response to ticket
router.post('/:id/responses', authenticate, (req, res) => {
  const { content } = req.body;
  const ticketIndex = tickets.findIndex(t => t.id === req.params.id);
  
  if (ticketIndex === -1) {
    return res.status(404).json({ message: 'Ticket not found' });
  }
  
  if (!content) {
    return res.status(400).json({ message: 'Response content is required' });
  }
  
  const newResponse = {
    id: `response-${uuidv4()}`,
    ticketId: req.params.id,
    content,
    createdAt: new Date().toISOString(),
    responder: req.user.id,
    isAIGenerated: false
  };
  
  tickets[ticketIndex].responses.push(newResponse);
  tickets[ticketIndex].updatedAt = new Date().toISOString();
  
  res.status(201).json(newResponse);
});

// Get ticket statistics
router.get('/stats/summary', authenticate, (req, res) => {
  const stats = {
    total: tickets.length,
    byStatus: {
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in-progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      closed: tickets.filter(t => t.status === 'closed').length
    },
    byPriority: {
      low: tickets.filter(t => t.priority === 'low').length,
      medium: tickets.filter(t => t.priority === 'medium').length,
      high: tickets.filter(t => t.priority === 'high').length,
      urgent: tickets.filter(t => t.priority === 'urgent').length
    },
    byHandler: {
      ai: tickets.filter(t => t.isAIHandled).length,
      human: tickets.filter(t => !t.isAIHandled).length,
      unassigned: tickets.filter(t => t.assignedTo === null).length
    },
    averageResponseTime: "4.2 hours" // This would be calculated in a real implementation
  };
  
  res.json(stats);
});

export default router; 