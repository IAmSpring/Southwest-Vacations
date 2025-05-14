import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name using ES module syntax
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define seed data
const trips = {
  trips: [
    {
      id: "trip1",
      destination: "Maui, Hawaii",
      location: {
        country: "USA",
        region: "Hawaii"
      },
      price: 1499.99,
      duration: 7,
      departureDate: "2025-07-10",
      returnDate: "2025-07-17",
      category: "beach",
      rating: 4.8,
      amenities: ["pool", "spa", "beachfront", "restaurant"],
      recommended: true,
      capacity: 4,
      availableDeals: ["Early Bird Special", "10% Southwest Employee Discount"],
      description: "Enjoy a relaxing week in paradise with white sandy beaches and crystal clear waters.",
      imageUrl: "https://images.unsplash.com/photo-1483168527879-c66136b56105?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1616&q=80"
    },
    {
      id: "trip2",
      destination: "Las Vegas, Nevada",
      location: {
        country: "USA",
        region: "West"
      },
      price: 899.99,
      duration: 4,
      departureDate: "2025-08-15",
      returnDate: "2025-08-19",
      category: "entertainment",
      rating: 4.5,
      amenities: ["pool", "casino", "spa", "restaurant", "nightclub"],
      recommended: false,
      capacity: 2,
      availableDeals: ["Last Minute Deal", "Casino Credit"],
      description: "Experience the excitement of Las Vegas with world-class entertainment and dining.",
      imageUrl: "https://images.unsplash.com/photo-1581351721010-8cf859cb14f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: "trip3",
      destination: "New York City, New York",
      location: {
        country: "USA",
        region: "East"
      },
      price: 1299.99,
      duration: 5,
      departureDate: "2025-09-20",
      returnDate: "2025-09-25",
      category: "city",
      rating: 4.3,
      amenities: ["central location", "restaurant", "fitness center"],
      recommended: true,
      capacity: 3,
      availableDeals: ["City Pass Included", "15% Southwest Employee Discount"],
      description: "Explore the Big Apple with its iconic landmarks, world-class museums, and diverse cuisine.",
      imageUrl: "https://images.unsplash.com/photo-1496588152823-86ff7695e68f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: "trip4",
      destination: "Cancun, Mexico",
      location: {
        country: "Mexico",
        region: "Caribbean"
      },
      price: 1099.99,
      duration: 6,
      departureDate: "2025-06-05",
      returnDate: "2025-06-11",
      category: "beach",
      rating: 4.6,
      amenities: ["all-inclusive", "beachfront", "pool", "spa", "restaurant"],
      recommended: true,
      capacity: 4,
      availableDeals: ["All-Inclusive Package", "Free Airport Transfer"],
      description: "Enjoy the beautiful beaches and vibrant nightlife of Cancun with all-inclusive amenities.",
      imageUrl: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
    },
    {
      id: "trip5",
      destination: "Aspen, Colorado",
      location: {
        country: "USA",
        region: "West"
      },
      price: 1899.99,
      duration: 7,
      departureDate: "2025-12-10",
      returnDate: "2025-12-17",
      category: "mountain",
      rating: 4.7,
      amenities: ["ski-in/ski-out", "fireplace", "hot tub", "restaurant"],
      recommended: false,
      capacity: 6,
      availableDeals: ["Early Bird Ski Package", "5% Southwest Employee Discount"],
      description: "Experience world-class skiing and winter sports in the beautiful mountains of Aspen.",
      imageUrl: "https://images.unsplash.com/photo-1520986606214-8b456906c813?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    }
  ]
};

const bookings = {
  bookings: [
    {
      id: "booking1",
      userId: "user1",
      tripId: "trip1",
      status: "confirmed",
      confirmationCode: "SWV12345",
      totalPrice: 1499.99,
      passengers: [
        {
          id: "passenger1",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "555-123-4567"
        }
      ],
      createdAt: "2023-10-15T10:30:00Z"
    },
    {
      id: "booking2",
      userId: "user1",
      tripId: "trip2",
      status: "confirmed",
      confirmationCode: "SWV23456",
      totalPrice: 899.99 * 2,
      passengers: [
        {
          id: "passenger2",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "555-123-4567"
        },
        {
          id: "passenger3",
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@example.com",
          phone: "555-765-4321"
        }
      ],
      createdAt: "2023-11-05T14:20:00Z"
    },
    {
      id: "booking3",
      userId: "user2",
      tripId: "trip3",
      status: "confirmed",
      confirmationCode: "SWV34567",
      totalPrice: 1299.99,
      passengers: [
        {
          id: "passenger4",
          firstName: "Sarah",
          lastName: "Johnson",
          email: "sarah@example.com",
          phone: "555-987-6543"
        }
      ],
      createdAt: "2023-11-10T09:15:00Z"
    }
  ]
};

const users = {
  users: [
    {
      id: "user1",
      name: "Test User",
      email: "test@example.com",
      password: "password123", // In a real app, this would be hashed
      role: "user",
      isEmployee: false,
      createdAt: "2023-09-15T08:30:00Z",
      membershipLevel: "Silver",
      phoneNumber: "555-123-4567",
      preferences: {
        notifications: true,
        newsletter: true,
        marketing: false
      }
    },
    {
      id: "user2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      password: "password123", 
      role: "user",
      isEmployee: false,
      createdAt: "2023-08-22T14:45:00Z",
      membershipLevel: "Gold",
      phoneNumber: "555-987-6543",
      preferences: {
        notifications: true,
        newsletter: false,
        marketing: false
      }
    },
    {
      id: "user3",
      name: "Regular Customer",
      email: "customer@example.com",
      password: "customer123", 
      role: "user",
      isEmployee: false,
      createdAt: "2023-10-05T09:15:00Z",
      membershipLevel: "Bronze",
      phoneNumber: "555-456-7890",
      preferences: {
        notifications: true,
        newsletter: true,
        marketing: true
      }
    },
    {
      id: "user4",
      name: "Premium Member",
      email: "premium@example.com",
      password: "premium123", 
      role: "user",
      isEmployee: false,
      createdAt: "2023-07-18T11:22:00Z",
      membershipLevel: "Platinum",
      phoneNumber: "555-789-1234",
      preferences: {
        notifications: true,
        newsletter: true,
        marketing: true
      }
    },
    {
      id: "admin1",
      name: "Admin User",
      email: "admin@southwest.com",
      password: "admin123",
      role: "admin",
      isEmployee: true,
      employeeId: "EMP12345",
      createdAt: "2023-06-01T08:00:00Z",
      department: "Customer Service",
      accessLevel: "Full",
      managerName: "Jennifer Wilson"
    },
    {
      id: "admin2",
      name: "System Administrator",
      email: "sysadmin@southwest.com",
      password: "sysadmin123",
      role: "admin",
      isEmployee: true,
      employeeId: "EMP67890",
      createdAt: "2023-05-15T10:30:00Z",
      department: "IT",
      accessLevel: "System",
      managerName: "David Rodriguez"
    },
    {
      id: "agent1",
      name: "Booking Agent",
      email: "agent@southwest.com",
      password: "agent123",
      role: "agent",
      isEmployee: true,
      employeeId: "EMP54321",
      createdAt: "2023-07-10T09:45:00Z",
      department: "Bookings",
      accessLevel: "Limited",
      managerName: "Jennifer Wilson"
    }
  ]
};

const training = {
  courses: [
    {
      id: "course1",
      title: "Vacation Booking Basics",
      description: "Learn the fundamentals of vacation booking",
      modules: [
        {
          id: "module1",
          title: "Introduction to Vacation Packages",
          content: "<h2>Introduction to Vacation Packages</h2><p>Welcome to the training module for Southwest Vacations booking system! This module will cover the basics of our vacation packages.</p>",
          quiz: {
            id: "quiz1",
            questions: [
              {
                id: "q1",
                text: "What is the standard cancellation policy for vacation packages?",
                options: [
                  "24 hours notice with full refund",
                  "48 hours notice with full refund",
                  "72 hours notice with full refund",
                  "No refunds allowed"
                ],
                correctAnswer: 1
              },
              {
                id: "q2",
                text: "Which of the following is NOT a Southwest Vacations destination?",
                options: ["Hawaii", "Las Vegas", "Tokyo", "Cancun"],
                correctAnswer: 2
              }
            ]
          }
        },
        {
          id: "module2",
          title: "Booking Process Overview",
          content: "<h2>Booking Process Overview</h2><p>This module covers the step-by-step process of booking vacations for customers.</p>",
          quiz: {
            id: "quiz2",
            questions: [
              {
                id: "q1",
                text: "What information is required to complete a booking?",
                options: [
                  "Name and email only",
                  "Name, email, and phone number",
                  "Name, email, phone number, and payment method",
                  "Name, email, phone number, payment method, and address"
                ],
                correctAnswer: 3
              }
            ]
          }
        }
      ],
      certification: {
        type: "Basic Booking",
        validMonths: 12,
        passingScore: 80
      }
    },
    {
      id: "course2",
      title: "Advanced Booking Scenarios",
      description: "Handle complex booking situations",
      modules: [
        {
          id: "module1",
          title: "Multi-Passenger Bookings",
          content: "<h2>Multi-Passenger Bookings</h2><p>This module covers handling bookings with multiple passengers.</p>",
          quiz: {
            id: "quiz1",
            questions: [
              {
                id: "q1",
                text: "What is the maximum number of passengers allowed in a single booking?",
                options: ["4", "6", "8", "10"],
                correctAnswer: 2
              }
            ]
          }
        },
        {
          id: "module2",
          title: "Multi-Location Trips",
          content: "<h2>Multi-Location Trips</h2><p>This module covers booking trips with multiple destinations.</p>",
          quiz: {
            id: "quiz1",
            questions: [
              {
                id: "q1",
                text: "How many destinations can be included in a multi-location trip?",
                options: ["2", "3", "4", "5"],
                correctAnswer: 3
              }
            ]
          }
        }
      ],
      certification: {
        type: "Advanced Booking",
        validMonths: 12,
        passingScore: 80
      }
    }
  ],
  progress: {
    user1: {
      courses: {
        course1: {
          completed: false,
          progress: 50,
          completedModules: ["module1"],
          lastAccessed: "2023-11-01T15:30:00Z"
        }
      }
    },
    emp1: {
      courses: {
        course1: {
          completed: true,
          progress: 100,
          completedModules: ["module1", "module2"],
          lastAccessed: "2023-10-15T12:00:00Z"
        },
        course2: {
          completed: false,
          progress: 50,
          completedModules: ["module1"],
          lastAccessed: "2023-11-05T09:45:00Z"
        }
      },
      certifications: [
        {
          id: "cert1",
          courseId: "course1",
          type: "Basic Booking",
          issuedDate: "2023-10-15T12:00:00Z",
          expiryDate: "2024-10-15T12:00:00Z",
          status: "active"
        }
      ]
    }
  }
};

// Write data to files
const dataDir = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write trips data
fs.writeFileSync(
  path.join(dataDir, 'trips.json'),
  JSON.stringify(trips, null, 2)
);

// Write bookings data
fs.writeFileSync(
  path.join(dataDir, 'bookings.json'),
  JSON.stringify(bookings, null, 2)
);

// Write users data
fs.writeFileSync(
  path.join(dataDir, 'users.json'),
  JSON.stringify(users, null, 2)
);

// Write training data
fs.writeFileSync(
  path.join(dataDir, 'training.json'),
  JSON.stringify(training, null, 2)
);

console.log('Seed data created successfully!'); 