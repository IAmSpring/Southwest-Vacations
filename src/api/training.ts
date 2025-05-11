import {
  TrainingCourse,
  EmployeeTraining,
  Quiz,
  BookingPolicy,
  PolicyAcknowledgment,
} from '../sharedTypes';

// Mock training data
const mockCourses: TrainingCourse[] = [
  {
    id: 'course1',
    title: 'Booking System Fundamentals',
    description:
      'Learn the basics of the Southwest Vacations booking system, including search, reservation, and payment processing.',
    category: 'required',
    durationMinutes: 60,
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-04-10T00:00:00Z',
    modules: [
      {
        id: 'module1-1',
        title: 'Introduction to the Booking System',
        content: 'Overview of the booking system architecture and components.',
        type: 'video',
        resourceUrl: 'https://example.com/videos/booking-intro',
      },
      {
        id: 'module1-2',
        title: 'Search and Reservation Process',
        content: 'Step-by-step guide to the search and reservation workflow.',
        type: 'text',
        resourceUrl: '',
      },
      {
        id: 'module1-3',
        title: 'Payment Processing',
        content: 'Overview of payment methods, verification, and security protocols.',
        type: 'interactive',
        resourceUrl: 'https://example.com/interactive/payment-demo',
      },
    ],
  },
  {
    id: 'course2',
    title: 'Customer Service Excellence',
    description:
      'Develop skills to provide exceptional customer service and handle difficult situations effectively.',
    category: 'optional',
    durationMinutes: 90,
    createdAt: '2023-02-20T00:00:00Z',
    updatedAt: '2023-03-15T00:00:00Z',
    modules: [
      {
        id: 'module2-1',
        title: 'Service Standards',
        content: 'Southwest Airlines service standards and expectations.',
        type: 'text',
        resourceUrl: '',
      },
      {
        id: 'module2-2',
        title: 'Difficult Customer Scenarios',
        content: 'Techniques for de-escalation and problem resolution.',
        type: 'video',
        resourceUrl: 'https://example.com/videos/difficult-customers',
      },
    ],
  },
  {
    id: 'course3',
    title: 'Security and Compliance Training',
    description:
      'Essential security protocols and compliance requirements for handling customer data and payments.',
    category: 'required',
    durationMinutes: 120,
    createdAt: '2023-03-10T00:00:00Z',
    updatedAt: '2023-03-10T00:00:00Z',
    modules: [
      {
        id: 'module3-1',
        title: 'Data Protection Fundamentals',
        content: 'Overview of PII, data classification, and protection requirements.',
        type: 'text',
        resourceUrl: '',
      },
      {
        id: 'module3-2',
        title: 'Payment Card Industry (PCI) Compliance',
        content: 'Requirements for handling credit card information securely.',
        type: 'video',
        resourceUrl: 'https://example.com/videos/pci-compliance',
      },
      {
        id: 'module3-3',
        title: 'Security Incident Response',
        content: 'Steps to take when encountering a security incident.',
        type: 'interactive',
        resourceUrl: 'https://example.com/interactive/security-simulation',
      },
    ],
  },
];

const mockTrainingProgress: EmployeeTraining[] = [
  {
    id: 'progress1',
    employeeId: 'emp1',
    courseId: 'course1',
    status: 'completed',
    completedModules: ['module1-1', 'module1-2', 'module1-3'],
    startDate: '2023-04-15T00:00:00Z',
    completionDate: '2023-04-17T00:00:00Z',
    quizResults: {
      score: 95,
      passed: true,
      attemptCount: 1,
    },
  },
  {
    id: 'progress2',
    employeeId: 'emp1',
    courseId: 'course2',
    status: 'in-progress',
    completedModules: ['module2-1'],
    startDate: '2023-05-01T00:00:00Z',
    completionDate: null,
    quizResults: null,
  },
  {
    id: 'progress3',
    employeeId: 'emp1',
    courseId: 'course3',
    status: 'not-started',
    completedModules: [],
    startDate: null,
    completionDate: null,
    quizResults: null,
  },
];

const mockPolicies: BookingPolicy[] = [
  {
    id: 'policy1',
    title: 'Refund Policy',
    description: 'Guidelines for processing refunds and cancellations.',
    content:
      'Cancellations made 72+ hours before departure receive a full refund. Cancellations made 24-72 hours before departure incur a 50% fee. Cancellations made less than 24 hours before departure are non-refundable.',
    category: 'booking',
    version: '2.1',
    effectiveDate: '2023-01-01T00:00:00Z',
    lastUpdated: '2023-03-15T00:00:00Z',
  },
  {
    id: 'policy2',
    title: 'Special Accommodations Policy',
    description: 'Procedures for handling special accommodation requests.',
    content:
      'Customers requiring special accommodations should notify us at least 72 hours in advance. We will make reasonable efforts to accommodate all requests based on availability and partner capabilities.',
    category: 'booking',
    version: '1.3',
    effectiveDate: '2023-02-15T00:00:00Z',
    lastUpdated: '2023-04-10T00:00:00Z',
  },
];

const mockAcknowledgments: PolicyAcknowledgment[] = [
  {
    id: 'ack1',
    employeeId: 'emp1',
    policyId: 'policy1',
    acknowledgedAt: '2023-03-20T00:00:00Z',
    policyVersion: '2.1',
  },
];

// API Functions
export const getCourses = async (): Promise<TrainingCourse[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockCourses;
};

export const getCourseById = async (courseId: string): Promise<TrainingCourse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const course = mockCourses.find(c => c.id === courseId);
  if (!course) {
    throw new Error('Course not found');
  }

  return course;
};

export const getTrainingProgress = async (): Promise<EmployeeTraining[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockTrainingProgress;
};

export const getCourseProgress = async (courseId: string): Promise<EmployeeTraining | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const progress = mockTrainingProgress.find(p => p.courseId === courseId);
  return progress || null;
};

export const updateTrainingProgress = async (
  courseId: string,
  moduleId: string,
  completed: boolean
): Promise<EmployeeTraining> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));

  // Find existing progress or create a new one
  let progress = mockTrainingProgress.find(p => p.courseId === courseId);

  if (!progress) {
    // Create new progress entry
    progress = {
      id: `progress-${Date.now()}`,
      employeeId: 'emp1', // Assuming current user
      courseId,
      status: 'in-progress',
      completedModules: completed ? [moduleId] : [],
      startDate: new Date().toISOString(),
      completionDate: null,
      quizResults: null,
    };

    mockTrainingProgress.push(progress);
  } else {
    // Update existing progress
    if (completed && !progress.completedModules.includes(moduleId)) {
      progress.completedModules.push(moduleId);
    } else if (!completed && progress.completedModules.includes(moduleId)) {
      progress.completedModules = progress.completedModules.filter(id => id !== moduleId);
    }

    // Update status
    const course = mockCourses.find(c => c.id === courseId);
    if (course) {
      const totalModules = course.modules.length;
      const completedCount = progress.completedModules.length;

      if (completedCount === 0) {
        progress.status = 'not-started';
      } else if (completedCount < totalModules) {
        progress.status = 'in-progress';
      } else {
        progress.status = 'completed';
        progress.completionDate = new Date().toISOString();
      }
    }
  }

  return progress;
};

export const submitQuizResults = async (
  courseId: string,
  results: Quiz
): Promise<EmployeeTraining> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  // Find progress for this course
  const progress = mockTrainingProgress.find(p => p.courseId === courseId);

  if (!progress) {
    throw new Error('No training progress found for this course');
  }

  // Update quiz results
  progress.quizResults = {
    score: results.score,
    passed: results.score >= 70, // Assuming 70% is passing score
    attemptCount: (progress.quizResults?.attemptCount || 0) + 1,
  };

  // If passed, mark as completed
  if (progress.quizResults.passed) {
    progress.status = 'completed';
    progress.completionDate = new Date().toISOString();

    // Ensure all modules are marked as completed
    const course = mockCourses.find(c => c.id === courseId);
    if (course) {
      progress.completedModules = course.modules.map(m => m.id);
    }
  }

  return progress;
};

export const completeCourse = async (courseId: string): Promise<EmployeeTraining> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Find progress for this course
  const progress = mockTrainingProgress.find(p => p.courseId === courseId);

  if (!progress) {
    throw new Error('No training progress found for this course');
  }

  // Mark as completed
  progress.status = 'completed';
  progress.completionDate = new Date().toISOString();

  // Ensure all modules are marked as completed
  const course = mockCourses.find(c => c.id === courseId);
  if (course) {
    progress.completedModules = course.modules.map(m => m.id);
  }

  return progress;
};

export const getBookingPolicies = async (): Promise<BookingPolicy[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockPolicies;
};

export const getPolicyAcknowledgments = async (): Promise<PolicyAcknowledgment[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockAcknowledgments;
};

export const acknowledgePolicy = async (policyId: string): Promise<PolicyAcknowledgment> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const policy = mockPolicies.find(p => p.id === policyId);
  if (!policy) {
    throw new Error('Policy not found');
  }

  // Create a new acknowledgment
  const acknowledgment: PolicyAcknowledgment = {
    id: `ack-${Date.now()}`,
    employeeId: 'emp1', // Assuming current user
    policyId,
    acknowledgedAt: new Date().toISOString(),
    policyVersion: policy.version,
  };

  mockAcknowledgments.push(acknowledgment);

  return acknowledgment;
};
