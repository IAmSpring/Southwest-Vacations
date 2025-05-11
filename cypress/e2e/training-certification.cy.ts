/// <reference types="cypress" />

describe('Employee Training and Certification Process', () => {
  const TEST_EMPLOYEE = {
    email: 'employee@southwest.com',
    password: 'password123',
    name: 'Employee User',
    employeeId: 'EMP12345',
  };

  beforeEach(() => {
    // Reset cookies and localStorage before each test
    cy.clearCookies();
    cy.clearLocalStorage();

    // Set up employee authentication
    cy.intercept('POST', '/api/users/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        user: {
          id: 'emp123',
          name: TEST_EMPLOYEE.name,
          email: TEST_EMPLOYEE.email,
          isEmployee: true,
          employeeId: TEST_EMPLOYEE.employeeId,
        },
      },
    }).as('loginEmployee');

    // Mock training courses API
    cy.intercept('GET', '/api/training/courses', {
      statusCode: 200,
      body: [
        {
          id: 'course1',
          title: 'Vacation Booking Basics',
          description: 'Learn the fundamentals of vacation booking',
          modules: 3,
          estimatedHours: 2,
          required: true,
          certification: {
            type: 'Basic Booking',
            validMonths: 12,
          },
        },
        {
          id: 'course2',
          title: 'Advanced Booking Scenarios',
          description: 'Handle complex booking situations',
          modules: 4,
          estimatedHours: 3,
          required: true,
          certification: {
            type: 'Advanced Booking',
            validMonths: 12,
          },
        },
        {
          id: 'course3',
          title: 'Customer Service Excellence',
          description: 'Provide exceptional customer service',
          modules: 2,
          estimatedHours: 1.5,
          required: false,
          certification: {
            type: 'Customer Service',
            validMonths: 6,
          },
        },
      ],
    }).as('getTrainingCourses');

    // Mock course progress API
    cy.intercept('GET', '/api/training/progress', {
      statusCode: 200,
      body: {
        courses: {
          course1: {
            completed: false,
            progress: 0,
            completedModules: [],
            lastAccessed: null,
          },
          course2: {
            completed: false,
            progress: 0,
            completedModules: [],
            lastAccessed: null,
          },
          course3: {
            completed: false,
            progress: 0,
            completedModules: [],
            lastAccessed: null,
          },
        },
        certifications: [],
      },
    }).as('getTrainingProgress');

    // Mock course details API
    cy.intercept('GET', '/api/training/courses/course1', {
      statusCode: 200,
      body: {
        id: 'course1',
        title: 'Vacation Booking Basics',
        description: 'Learn the fundamentals of vacation booking',
        modules: [
          {
            id: 'module1',
            title: 'Introduction to Vacation Packages',
            content: 'Module content here...',
            quiz: {
              id: 'quiz1',
              questions: [
                {
                  id: 'q1',
                  text: 'What is the standard cancellation policy for vacation packages?',
                  options: [
                    '24 hours notice with full refund',
                    '48 hours notice with full refund',
                    '72 hours notice with full refund',
                    'No refunds allowed',
                  ],
                  correctAnswer: 1,
                },
                {
                  id: 'q2',
                  text: 'Which of the following is NOT a Southwest Vacations destination?',
                  options: ['Hawaii', 'Las Vegas', 'Tokyo', 'Cancun'],
                  correctAnswer: 2,
                },
              ],
            },
          },
          {
            id: 'module2',
            title: 'Booking Process Overview',
            content: 'Module content here...',
            quiz: {
              id: 'quiz2',
              questions: [
                {
                  id: 'q1',
                  text: 'What information is required to complete a booking?',
                  options: [
                    'Name and email only',
                    'Name, email, and phone number',
                    'Name, email, phone number, and payment method',
                    'Name, email, phone number, payment method, and address',
                  ],
                  correctAnswer: 3,
                },
              ],
            },
          },
          {
            id: 'module3',
            title: 'Special Requests and Accommodations',
            content: 'Module content here...',
            quiz: {
              id: 'quiz3',
              questions: [
                {
                  id: 'q1',
                  text: 'How should special dietary requests be handled?',
                  options: [
                    'Noted in the booking and forwarded to the hotel',
                    'Ignored as they cannot be accommodated',
                    'Handled by the customer directly with the hotel',
                    'Referred to a supervisor',
                  ],
                  correctAnswer: 0,
                },
              ],
            },
          },
        ],
        certification: {
          type: 'Basic Booking',
          validMonths: 12,
          passingScore: 80,
        },
      },
    }).as('getCourseDetails');

    // Mock module completion
    cy.intercept('POST', '/api/training/courses/*/modules/*/complete', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Module completed successfully',
      },
    }).as('completeModule');

    // Mock quiz submission
    cy.intercept('POST', '/api/training/courses/*/modules/*/quiz', {
      statusCode: 200,
      body: {
        score: 90,
        passed: true,
        feedback: 'Great job! You passed the quiz.',
        correctAnswers: 2,
        totalQuestions: 2,
      },
    }).as('submitQuiz');

    // Mock course completion
    cy.intercept('POST', '/api/training/courses/*/complete', {
      statusCode: 200,
      body: {
        success: true,
        certification: {
          id: 'cert123',
          type: 'Basic Booking',
          issuedDate: new Date().toISOString(),
          expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
          status: 'active',
        },
      },
    }).as('completeCourse');

    // Mock policy acceptance
    cy.intercept('POST', '/api/training/policies/accept', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Policy acceptance recorded',
      },
    }).as('acceptPolicy');
  });

  it('allows employee to complete a training course and receive certification', () => {
    // Login as employee
    cy.visit('/employee-portal');
    cy.get('input[name="email"]').type(TEST_EMPLOYEE.email);
    cy.get('input[name="password"]').type(TEST_EMPLOYEE.password);
    cy.contains('Login').click();
    cy.wait('@loginEmployee');

    // Navigate to training portal
    cy.contains('Training Portal').click();
    cy.url().should('include', '/training-portal');

    // Verify available courses are displayed
    cy.wait('@getTrainingCourses');
    cy.contains('Vacation Booking Basics').should('exist');
    cy.contains('Advanced Booking Scenarios').should('exist');
    cy.contains('Customer Service Excellence').should('exist');

    // Start the basic booking course
    cy.contains('Vacation Booking Basics').parent().contains('Start Course').click();
    cy.wait('@getCourseDetails');
    cy.url().should('include', '/training-portal/course/course1');

    // Complete the first module
    cy.contains('Introduction to Vacation Packages').should('exist');
    cy.contains('Next').click();
    cy.contains('Take Quiz').click();

    // Answer quiz questions
    cy.get('[data-testid="quiz-question-0"]').within(() => {
      cy.contains('48 hours notice with full refund').click();
    });
    cy.get('[data-testid="quiz-question-1"]').within(() => {
      cy.contains('Tokyo').click();
    });
    cy.contains('Submit Quiz').click();
    cy.wait('@submitQuiz');

    // Verify quiz results
    cy.contains('Quiz Results').should('exist');
    cy.contains('90%').should('exist');
    cy.contains('You passed!').should('exist');
    cy.contains('Continue').click();
    cy.wait('@completeModule');

    // Complete the second module
    cy.contains('Booking Process Overview').should('exist');
    cy.contains('Next').click();
    cy.contains('Take Quiz').click();

    // Answer quiz question
    cy.get('[data-testid="quiz-question-0"]').within(() => {
      cy.contains('Name, email, phone number, payment method, and address').click();
    });
    cy.contains('Submit Quiz').click();
    cy.wait('@submitQuiz');
    cy.contains('Continue').click();
    cy.wait('@completeModule');

    // Complete the third module
    cy.contains('Special Requests and Accommodations').should('exist');
    cy.contains('Next').click();
    cy.contains('Take Quiz').click();

    // Answer quiz question
    cy.get('[data-testid="quiz-question-0"]').within(() => {
      cy.contains('Noted in the booking and forwarded to the hotel').click();
    });
    cy.contains('Submit Quiz').click();
    cy.wait('@submitQuiz');
    cy.contains('Continue').click();
    cy.wait('@completeModule');

    // Complete the course
    cy.contains('Course Complete').should('exist');
    cy.contains('Claim Certification').click();
    cy.wait('@completeCourse');

    // Verify certification
    cy.contains('Certification Awarded').should('exist');
    cy.contains('Basic Booking').should('exist');
    cy.contains('View My Certifications').click();

    // Verify certification appears in the list
    cy.url().should('include', '/training-portal/certifications');
    cy.contains('Basic Booking').should('exist');
    cy.contains('Active').should('exist');
  });

  it('requires employee to accept booking policy', () => {
    // Login as employee
    cy.visit('/employee-portal');
    cy.get('input[name="email"]').type(TEST_EMPLOYEE.email);
    cy.get('input[name="password"]').type(TEST_EMPLOYEE.password);
    cy.contains('Login').click();
    cy.wait('@loginEmployee');

    // Navigate to training portal
    cy.contains('Training Portal').click();
    cy.url().should('include', '/training-portal');

    // Go to policies section
    cy.contains('Booking Policies').click();
    cy.url().should('include', '/training-portal/policies');

    // View booking policy
    cy.contains('Vacation Booking Policy').click();

    // Read through policy sections
    cy.contains('General Booking Guidelines').should('exist');
    cy.contains('Cancellation Policy').should('exist');
    cy.contains('Customer Data Handling').should('exist');

    // Scroll to bottom to enable accept button
    cy.scrollTo('bottom');

    // Accept the policy
    cy.contains('I have read and accept this policy').click();
    cy.contains('Submit').click();
    cy.wait('@acceptPolicy');

    // Verify acceptance recorded
    cy.contains('Policy Accepted').should('exist');
    cy.contains('Return to Dashboard').click();

    // Verify policy status updated on dashboard
    cy.url().should('include', '/training-portal');
    cy.contains('Vacation Booking Policy').parent().contains('Accepted').should('exist');
  });
});
