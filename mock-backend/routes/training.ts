import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';
import {
  TrainingCourse,
  EmployeeTraining,
  BookingPolicy,
  PolicyAcknowledgment,
} from '../../src/sharedTypes.js';
import { extractUserId } from '../auth.js';

const router = express.Router();

// Sample booking policies
const bookingPolicies: BookingPolicy[] = [
  {
    id: uuidv4(),
    title: 'General Booking Terms & Conditions',
    content: 'These terms and conditions govern all bookings made through Southwest Vacations...',
    version: '2.1',
    effectiveDate: '2023-01-15',
    category: 'general',
    isActive: true,
    acknowledgmentRequired: true,
  },
  {
    id: uuidv4(),
    title: 'Refund & Cancellation Policy',
    content:
      'Customers may cancel their booking and receive a full refund within 24 hours of booking...',
    version: '3.2',
    effectiveDate: '2023-03-10',
    category: 'refunds',
    isActive: true,
    acknowledgmentRequired: true,
  },
  {
    id: uuidv4(),
    title: 'Multi-destination Booking Guidelines',
    content:
      'When booking multi-destination itineraries, each segment must have valid connecting options...',
    version: '1.5',
    effectiveDate: '2023-05-22',
    category: 'general',
    isActive: true,
    acknowledgmentRequired: true,
  },
  {
    id: uuidv4(),
    title: 'Customer Service Standards',
    content:
      'All customer interactions must meet the Southwest Airlines standard of hospitality...',
    version: '2.0',
    effectiveDate: '2023-04-01',
    category: 'customer-service',
    isActive: true,
    acknowledgmentRequired: true,
  },
];

// Sample training courses
const trainingCourses: TrainingCourse[] = [
  {
    id: uuidv4(),
    title: 'Booking System Fundamentals',
    description:
      'Learn the basics of the Southwest Vacations booking platform and customer service essentials.',
    duration: 120, // 2 hours
    modules: [
      {
        id: uuidv4(),
        title: 'Platform Introduction',
        content: 'Overview of the Southwest Vacations booking platform and its key features.',
        timeToComplete: 20,
        resourceLinks: ['/resources/platform-guide.pdf', '/resources/quick-reference.pdf'],
      },
      {
        id: uuidv4(),
        title: 'Creating Basic Bookings',
        content: 'Step-by-step guide to creating single and round-trip bookings for customers.',
        timeToComplete: 35,
        quizzes: [
          {
            id: uuidv4(),
            questions: [
              {
                id: uuidv4(),
                question: 'What information is required to create a basic booking?',
                options: [
                  'Customer name only',
                  'Customer name, email, and travel dates',
                  'Customer name, email, travel dates, and payment information',
                  'Only a confirmation number',
                ],
                correctAnswerIndex: 2,
              },
              {
                id: uuidv4(),
                question: 'When should you verify customer ID information?',
                options: [
                  "Never, it's not necessary",
                  'Only for international flights',
                  'Before completing any booking',
                  'Only when the customer requests it',
                ],
                correctAnswerIndex: 2,
              },
            ],
            passingScore: 80,
          },
        ],
      },
      {
        id: uuidv4(),
        title: 'Customer Service Essentials',
        content: 'Standards for customer interactions and handling common customer requests.',
        timeToComplete: 40,
        resourceLinks: ['/resources/service-standards.pdf'],
      },
      {
        id: uuidv4(),
        title: 'Troubleshooting Common Issues',
        content: 'How to identify and resolve common booking and customer service issues.',
        timeToComplete: 25,
        quizzes: [
          {
            id: uuidv4(),
            questions: [
              {
                id: uuidv4(),
                question: 'What is the first step when a customer reports a booking error?',
                options: [
                  'Tell them to contact IT support',
                  'Verify the booking details with the confirmation number',
                  'Immediately issue a refund',
                  'Ask them to try again later',
                ],
                correctAnswerIndex: 1,
              },
            ],
            passingScore: 70,
          },
        ],
      },
    ],
    requiredFor: ['all'],
    category: 'required',
    level: 'beginner',
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Advanced Booking Techniques',
    description:
      'Master multi-destination itineraries, group bookings, and special accommodation requests.',
    duration: 180, // 3 hours
    modules: [
      {
        id: uuidv4(),
        title: 'Multi-destination Booking Mastery',
        content: 'Creating complex multi-destination itineraries with multiple segments.',
        timeToComplete: 45,
        resourceLinks: ['/resources/multi-destination-guide.pdf'],
      },
      {
        id: uuidv4(),
        title: 'Group Booking Management',
        content: 'Techniques for managing large group bookings efficiently.',
        timeToComplete: 40,
        quizzes: [
          {
            id: uuidv4(),
            questions: [
              {
                id: uuidv4(),
                question:
                  'What is the maximum number of passengers allowed in a single group booking?',
                options: ['5', '8', '15', 'No limit'],
                correctAnswerIndex: 2,
              },
            ],
            passingScore: 80,
          },
        ],
      },
      {
        id: uuidv4(),
        title: 'Special Accommodations and Requests',
        content: 'Handling special needs, accessibility requirements, and custom requests.',
        timeToComplete: 35,
        resourceLinks: ['/resources/special-accommodations.pdf'],
      },
      {
        id: uuidv4(),
        title: 'Package Customization',
        content: 'Creating tailored vacation packages with custom add-ons and special offers.',
        timeToComplete: 60,
        quizzes: [
          {
            id: uuidv4(),
            questions: [
              {
                id: uuidv4(),
                question: 'Which add-on services can be included in a vacation package?',
                options: [
                  'Only hotels',
                  'Hotels and car rentals only',
                  'Hotels, car rentals, and activities',
                  'None of the above',
                ],
                correctAnswerIndex: 2,
              },
            ],
            passingScore: 80,
          },
        ],
      },
    ],
    requiredFor: ['booking_agent', 'supervisor'],
    category: 'certification',
    level: 'intermediate',
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Booking Policy Certification',
    description:
      'Comprehensive training on all Southwest Vacations booking policies and procedures.',
    duration: 150, // 2.5 hours
    modules: [
      {
        id: uuidv4(),
        title: 'Refund and Cancellation Policies',
        content: 'Understanding and applying the refund and cancellation policies correctly.',
        timeToComplete: 40,
        resourceLinks: ['/resources/refund-policy.pdf'],
      },
      {
        id: uuidv4(),
        title: 'Change Fee Structures',
        content: 'Overview of change fee structures and when they apply.',
        timeToComplete: 30,
        quizzes: [
          {
            id: uuidv4(),
            questions: [
              {
                id: uuidv4(),
                question: 'When can change fees be waived?',
                options: [
                  'Never',
                  'Only for Rapid Rewards members',
                  'In case of emergency or special circumstances',
                  'For any customer who asks',
                ],
                correctAnswerIndex: 2,
              },
            ],
            passingScore: 100,
          },
        ],
      },
      {
        id: uuidv4(),
        title: 'Discount Code Application',
        content: 'Rules and restrictions for applying promotional codes and discounts.',
        timeToComplete: 35,
        resourceLinks: ['/resources/promotion-guidelines.pdf'],
      },
      {
        id: uuidv4(),
        title: 'Regulatory Compliance',
        content: 'Ensuring bookings comply with all relevant regulations and requirements.',
        timeToComplete: 45,
        quizzes: [
          {
            id: uuidv4(),
            questions: [
              {
                id: uuidv4(),
                question: 'What customer information must be verified for international bookings?',
                options: [
                  'Nothing special is required',
                  'Just name and email',
                  'Full name as it appears on passport, passport number, and expiration date',
                  'Only their Rapid Rewards number',
                ],
                correctAnswerIndex: 2,
              },
            ],
            passingScore: 90,
          },
        ],
      },
    ],
    requiredFor: ['all'],
    category: 'certification',
    level: 'advanced',
    createdAt: new Date().toISOString(),
  },
];

// Sample employee training progress
const employeeTrainingProgress: EmployeeTraining[] = [
  {
    id: uuidv4(),
    userId: '1',
    courseId: trainingCourses[0].id,
    status: 'completed',
    progress: 100,
    startedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    completedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), // 28 days ago
    certificationExpiresAt: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(), // 335 days from now
    quizResults: [
      {
        quizId: trainingCourses[0].modules[1].quizzes![0].id,
        score: 90,
        passed: true,
        attemptCount: 1,
        lastAttemptAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        quizId: trainingCourses[0].modules[3].quizzes![0].id,
        score: 100,
        passed: true,
        attemptCount: 1,
        lastAttemptAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: uuidv4(),
    userId: '1',
    courseId: trainingCourses[1].id,
    status: 'in-progress',
    progress: 65,
    startedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    quizResults: [
      {
        quizId: trainingCourses[1].modules[1].quizzes![0].id,
        score: 80,
        passed: true,
        attemptCount: 2,
        lastAttemptAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: uuidv4(),
    userId: '1',
    courseId: trainingCourses[2].id,
    status: 'not-started',
    progress: 0,
  },
];

// Get all training courses
router.get('/courses', async (req: Request, res: Response) => {
  try {
    // In a real implementation, we'd fetch from a database
    // For now, return our sample data
    res.json(trainingCourses);
  } catch (error) {
    console.error('Error fetching training courses:', error);
    res.status(500).json({ error: 'Failed to fetch training courses' });
  }
});

// Get a specific training course by ID
router.get('/courses/:id', async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id;
    const course = trainingCourses.find(c => c.id === courseId);

    if (!course) {
      return res.status(404).json({ error: 'Training course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error fetching training course:', error);
    res.status(500).json({ error: 'Failed to fetch training course' });
  }
});

// Get training progress for the current user
router.get('/my-progress', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // In a real implementation, we'd query the database
    // For now, filter our sample data
    const userProgress = employeeTrainingProgress.filter(p => p.userId === userId);

    res.json(userProgress);
  } catch (error) {
    console.error('Error fetching training progress:', error);
    res.status(500).json({ error: 'Failed to fetch training progress' });
  }
});

// Start a training course
router.post('/start-course', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    // Check if course exists
    const course = trainingCourses.find(c => c.id === courseId);
    if (!course) {
      return res.status(404).json({ error: 'Training course not found' });
    }

    // Check if user already started this course
    const existingProgress = employeeTrainingProgress.find(
      p => p.userId === userId && p.courseId === courseId
    );

    if (existingProgress && existingProgress.status !== 'not-started') {
      return res.status(400).json({
        error: 'You have already started this course',
        progress: existingProgress,
      });
    }

    // In a real implementation, we'd update the database
    // For this mock, we'll update our array
    const newProgress: EmployeeTraining = {
      id: uuidv4(),
      userId,
      courseId,
      status: 'in-progress',
      progress: 0,
      startedAt: new Date().toISOString(),
    };

    if (existingProgress) {
      // Update existing record
      Object.assign(existingProgress, newProgress);
    } else {
      // Add new record
      employeeTrainingProgress.push(newProgress);
    }

    res.status(201).json(newProgress);
  } catch (error) {
    console.error('Error starting training course:', error);
    res.status(500).json({ error: 'Failed to start training course' });
  }
});

// Update training progress
router.put('/update-progress', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { courseId, moduleId, progress } = req.body;

    if (!courseId || !moduleId || progress === undefined) {
      return res.status(400).json({ error: 'Course ID, module ID, and progress are required' });
    }

    // Find existing progress
    const existingProgress = employeeTrainingProgress.find(
      p => p.userId === userId && p.courseId === courseId
    );

    if (!existingProgress) {
      return res.status(404).json({ error: 'No training progress found for this course' });
    }

    // Update progress
    existingProgress.progress = Math.max(existingProgress.progress, progress);

    // Update status if needed
    if (progress >= 100) {
      existingProgress.status = 'completed';
      existingProgress.completedAt = new Date().toISOString();

      // Set certification expiration date (1 year from completion)
      const expirationDate = new Date();
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);
      existingProgress.certificationExpiresAt = expirationDate.toISOString();
    }

    res.json(existingProgress);
  } catch (error) {
    console.error('Error updating training progress:', error);
    res.status(500).json({ error: 'Failed to update training progress' });
  }
});

// Submit quiz results
router.post('/submit-quiz', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { courseId, quizId, answers } = req.body;

    if (!courseId || !quizId || !answers) {
      return res.status(400).json({ error: 'Course ID, quiz ID, and answers are required' });
    }

    // Find the course and quiz
    const course = trainingCourses.find(c => c.id === courseId);
    if (!course) {
      return res.status(404).json({ error: 'Training course not found' });
    }

    let quiz;
    let moduleWithQuiz;

    for (const module of course.modules) {
      if (module.quizzes) {
        const foundQuiz = module.quizzes.find(q => q.id === quizId);
        if (foundQuiz) {
          quiz = foundQuiz;
          moduleWithQuiz = module;
          break;
        }
      }
    }

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found in this course' });
    }

    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswerIndex) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Find existing progress
    const existingProgress = employeeTrainingProgress.find(
      p => p.userId === userId && p.courseId === courseId
    );

    if (!existingProgress) {
      return res.status(404).json({ error: 'No training progress found for this course' });
    }

    // Update quiz results
    if (!existingProgress.quizResults) {
      existingProgress.quizResults = [];
    }

    const existingQuizResult = existingProgress.quizResults.find(r => r.quizId === quizId);

    if (existingQuizResult) {
      existingQuizResult.score = score;
      existingQuizResult.passed = passed;
      existingQuizResult.attemptCount += 1;
      existingQuizResult.lastAttemptAt = new Date().toISOString();
    } else {
      existingProgress.quizResults.push({
        quizId,
        score,
        passed,
        attemptCount: 1,
        lastAttemptAt: new Date().toISOString(),
      });
    }

    // Return result
    res.json({
      score,
      passed,
      requiredScore: quiz.passingScore,
      feedback: passed
        ? 'Congratulations! You passed the quiz.'
        : `You didn't reach the passing score of ${quiz.passingScore}%. Please review the module and try again.`,
      progress: existingProgress,
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

// Get all booking policies
router.get('/policies', async (req: Request, res: Response) => {
  try {
    res.json(bookingPolicies);
  } catch (error) {
    console.error('Error fetching booking policies:', error);
    res.status(500).json({ error: 'Failed to fetch booking policies' });
  }
});

// Acknowledge a policy
router.post('/acknowledge-policy', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { policyId } = req.body;

    if (!policyId) {
      return res.status(400).json({ error: 'Policy ID is required' });
    }

    // Check if policy exists
    const policy = bookingPolicies.find(p => p.id === policyId);
    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }

    // In a real implementation, we'd update the database
    const acknowledgment: PolicyAcknowledgment = {
      id: uuidv4(),
      userId,
      policyId,
      acknowledgedAt: new Date().toISOString(),
      version: policy.version,
    };

    res.status(201).json(acknowledgment);
  } catch (error) {
    console.error('Error acknowledging policy:', error);
    res.status(500).json({ error: 'Failed to acknowledge policy' });
  }
});

export default router;
