"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var uuid_1 = require("uuid");
var auth_js_1 = require("../auth.js");
var router = express_1.default.Router();
// Sample booking policies
var bookingPolicies = [
    {
        id: (0, uuid_1.v4)(),
        title: 'General Booking Terms & Conditions',
        content: 'These terms and conditions govern all bookings made through Southwest Vacations...',
        version: '2.1',
        effectiveDate: '2023-01-15',
        category: 'general',
        isActive: true,
        acknowledgmentRequired: true
    },
    {
        id: (0, uuid_1.v4)(),
        title: 'Refund & Cancellation Policy',
        content: 'Customers may cancel their booking and receive a full refund within 24 hours of booking...',
        version: '3.2',
        effectiveDate: '2023-03-10',
        category: 'refunds',
        isActive: true,
        acknowledgmentRequired: true
    },
    {
        id: (0, uuid_1.v4)(),
        title: 'Multi-destination Booking Guidelines',
        content: 'When booking multi-destination itineraries, each segment must have valid connecting options...',
        version: '1.5',
        effectiveDate: '2023-05-22',
        category: 'general',
        isActive: true,
        acknowledgmentRequired: true
    },
    {
        id: (0, uuid_1.v4)(),
        title: 'Customer Service Standards',
        content: 'All customer interactions must meet the Southwest Airlines standard of hospitality...',
        version: '2.0',
        effectiveDate: '2023-04-01',
        category: 'customer-service',
        isActive: true,
        acknowledgmentRequired: true
    }
];
// Sample training courses
var trainingCourses = [
    {
        id: (0, uuid_1.v4)(),
        title: 'Booking System Fundamentals',
        description: 'Learn the basics of the Southwest Vacations booking platform and customer service essentials.',
        duration: 120,
        modules: [
            {
                id: (0, uuid_1.v4)(),
                title: 'Platform Introduction',
                content: 'Overview of the Southwest Vacations booking platform and its key features.',
                timeToComplete: 20,
                resourceLinks: ['/resources/platform-guide.pdf', '/resources/quick-reference.pdf']
            },
            {
                id: (0, uuid_1.v4)(),
                title: 'Creating Basic Bookings',
                content: 'Step-by-step guide to creating single and round-trip bookings for customers.',
                timeToComplete: 35,
                quizzes: [
                    {
                        id: (0, uuid_1.v4)(),
                        questions: [
                            {
                                id: (0, uuid_1.v4)(),
                                question: 'What information is required to create a basic booking?',
                                options: [
                                    'Customer name only',
                                    'Customer name, email, and travel dates',
                                    'Customer name, email, travel dates, and payment information',
                                    'Only a confirmation number'
                                ],
                                correctAnswerIndex: 2
                            },
                            {
                                id: (0, uuid_1.v4)(),
                                question: 'When should you verify customer ID information?',
                                options: [
                                    'Never, it\'s not necessary',
                                    'Only for international flights',
                                    'Before completing any booking',
                                    'Only when the customer requests it'
                                ],
                                correctAnswerIndex: 2
                            }
                        ],
                        passingScore: 80
                    }
                ]
            },
            {
                id: (0, uuid_1.v4)(),
                title: 'Customer Service Essentials',
                content: 'Standards for customer interactions and handling common customer requests.',
                timeToComplete: 40,
                resourceLinks: ['/resources/service-standards.pdf']
            },
            {
                id: (0, uuid_1.v4)(),
                title: 'Troubleshooting Common Issues',
                content: 'How to identify and resolve common booking and customer service issues.',
                timeToComplete: 25,
                quizzes: [
                    {
                        id: (0, uuid_1.v4)(),
                        questions: [
                            {
                                id: (0, uuid_1.v4)(),
                                question: 'What is the first step when a customer reports a booking error?',
                                options: [
                                    'Tell them to contact IT support',
                                    'Verify the booking details with the confirmation number',
                                    'Immediately issue a refund',
                                    'Ask them to try again later'
                                ],
                                correctAnswerIndex: 1
                            }
                        ],
                        passingScore: 70
                    }
                ]
            }
        ],
        requiredFor: ['all'],
        category: 'required',
        level: 'beginner',
        createdAt: new Date().toISOString(),
    },
    {
        id: (0, uuid_1.v4)(),
        title: 'Advanced Booking Techniques',
        description: 'Master multi-destination itineraries, group bookings, and special accommodation requests.',
        duration: 180,
        modules: [
            {
                id: (0, uuid_1.v4)(),
                title: 'Multi-destination Booking Mastery',
                content: 'Creating complex multi-destination itineraries with multiple segments.',
                timeToComplete: 45,
                resourceLinks: ['/resources/multi-destination-guide.pdf']
            },
            {
                id: (0, uuid_1.v4)(),
                title: 'Group Booking Management',
                content: 'Techniques for managing large group bookings efficiently.',
                timeToComplete: 40,
                quizzes: [
                    {
                        id: (0, uuid_1.v4)(),
                        questions: [
                            {
                                id: (0, uuid_1.v4)(),
                                question: 'What is the maximum number of passengers allowed in a single group booking?',
                                options: ['5', '8', '15', 'No limit'],
                                correctAnswerIndex: 2
                            }
                        ],
                        passingScore: 80
                    }
                ]
            },
            {
                id: (0, uuid_1.v4)(),
                title: 'Special Accommodations and Requests',
                content: 'Handling special needs, accessibility requirements, and custom requests.',
                timeToComplete: 35,
                resourceLinks: ['/resources/special-accommodations.pdf']
            },
            {
                id: (0, uuid_1.v4)(),
                title: 'Package Customization',
                content: 'Creating tailored vacation packages with custom add-ons and special offers.',
                timeToComplete: 60,
                quizzes: [
                    {
                        id: (0, uuid_1.v4)(),
                        questions: [
                            {
                                id: (0, uuid_1.v4)(),
                                question: 'Which add-on services can be included in a vacation package?',
                                options: [
                                    'Only hotels',
                                    'Hotels and car rentals only',
                                    'Hotels, car rentals, and activities',
                                    'None of the above'
                                ],
                                correctAnswerIndex: 2
                            }
                        ],
                        passingScore: 80
                    }
                ]
            }
        ],
        requiredFor: ['booking_agent', 'supervisor'],
        category: 'certification',
        level: 'intermediate',
        createdAt: new Date().toISOString(),
    },
    {
        id: (0, uuid_1.v4)(),
        title: 'Booking Policy Certification',
        description: 'Comprehensive training on all Southwest Vacations booking policies and procedures.',
        duration: 150,
        modules: [
            {
                id: (0, uuid_1.v4)(),
                title: 'Refund and Cancellation Policies',
                content: 'Understanding and applying the refund and cancellation policies correctly.',
                timeToComplete: 40,
                resourceLinks: ['/resources/refund-policy.pdf']
            },
            {
                id: (0, uuid_1.v4)(),
                title: 'Change Fee Structures',
                content: 'Overview of change fee structures and when they apply.',
                timeToComplete: 30,
                quizzes: [
                    {
                        id: (0, uuid_1.v4)(),
                        questions: [
                            {
                                id: (0, uuid_1.v4)(),
                                question: 'When can change fees be waived?',
                                options: [
                                    'Never',
                                    'Only for Rapid Rewards members',
                                    'In case of emergency or special circumstances',
                                    'For any customer who asks'
                                ],
                                correctAnswerIndex: 2
                            }
                        ],
                        passingScore: 100
                    }
                ]
            },
            {
                id: (0, uuid_1.v4)(),
                title: 'Discount Code Application',
                content: 'Rules and restrictions for applying promotional codes and discounts.',
                timeToComplete: 35,
                resourceLinks: ['/resources/promotion-guidelines.pdf']
            },
            {
                id: (0, uuid_1.v4)(),
                title: 'Regulatory Compliance',
                content: 'Ensuring bookings comply with all relevant regulations and requirements.',
                timeToComplete: 45,
                quizzes: [
                    {
                        id: (0, uuid_1.v4)(),
                        questions: [
                            {
                                id: (0, uuid_1.v4)(),
                                question: 'What customer information must be verified for international bookings?',
                                options: [
                                    'Nothing special is required',
                                    'Just name and email',
                                    'Full name as it appears on passport, passport number, and expiration date',
                                    'Only their Rapid Rewards number'
                                ],
                                correctAnswerIndex: 2
                            }
                        ],
                        passingScore: 90
                    }
                ]
            }
        ],
        requiredFor: ['all'],
        category: 'certification',
        level: 'advanced',
        createdAt: new Date().toISOString(),
    }
];
// Sample employee training progress
var employeeTrainingProgress = [
    {
        id: (0, uuid_1.v4)(),
        userId: '1',
        courseId: trainingCourses[0].id,
        status: 'completed',
        progress: 100,
        startedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
        certificationExpiresAt: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
        quizResults: [
            {
                quizId: trainingCourses[0].modules[1].quizzes[0].id,
                score: 90,
                passed: true,
                attemptCount: 1,
                lastAttemptAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                quizId: trainingCourses[0].modules[3].quizzes[0].id,
                score: 100,
                passed: true,
                attemptCount: 1,
                lastAttemptAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString()
            }
        ]
    },
    {
        id: (0, uuid_1.v4)(),
        userId: '1',
        courseId: trainingCourses[1].id,
        status: 'in-progress',
        progress: 65,
        startedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        quizResults: [
            {
                quizId: trainingCourses[1].modules[1].quizzes[0].id,
                score: 80,
                passed: true,
                attemptCount: 2,
                lastAttemptAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
            }
        ]
    },
    {
        id: (0, uuid_1.v4)(),
        userId: '1',
        courseId: trainingCourses[2].id,
        status: 'not-started',
        progress: 0
    }
];
// Get all training courses
router.get('/courses', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            // In a real implementation, we'd fetch from a database
            // For now, return our sample data
            res.json(trainingCourses);
        }
        catch (error) {
            console.error('Error fetching training courses:', error);
            res.status(500).json({ error: 'Failed to fetch training courses' });
        }
        return [2 /*return*/];
    });
}); });
// Get a specific training course by ID
router.get('/courses/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var courseId_1, course;
    return __generator(this, function (_a) {
        try {
            courseId_1 = req.params.id;
            course = trainingCourses.find(function (c) { return c.id === courseId_1; });
            if (!course) {
                return [2 /*return*/, res.status(404).json({ error: 'Training course not found' })];
            }
            res.json(course);
        }
        catch (error) {
            console.error('Error fetching training course:', error);
            res.status(500).json({ error: 'Failed to fetch training course' });
        }
        return [2 /*return*/];
    });
}); });
// Get training progress for the current user
router.get('/my-progress', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_1, userProgress;
    return __generator(this, function (_a) {
        try {
            userId_1 = (0, auth_js_1.extractUserId)(req);
            if (!userId_1) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            userProgress = employeeTrainingProgress.filter(function (p) { return p.userId === userId_1; });
            res.json(userProgress);
        }
        catch (error) {
            console.error('Error fetching training progress:', error);
            res.status(500).json({ error: 'Failed to fetch training progress' });
        }
        return [2 /*return*/];
    });
}); });
// Start a training course
router.post('/start-course', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_2, courseId_2, course, existingProgress, newProgress;
    return __generator(this, function (_a) {
        try {
            userId_2 = (0, auth_js_1.extractUserId)(req);
            if (!userId_2) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            courseId_2 = req.body.courseId;
            if (!courseId_2) {
                return [2 /*return*/, res.status(400).json({ error: 'Course ID is required' })];
            }
            course = trainingCourses.find(function (c) { return c.id === courseId_2; });
            if (!course) {
                return [2 /*return*/, res.status(404).json({ error: 'Training course not found' })];
            }
            existingProgress = employeeTrainingProgress.find(function (p) { return p.userId === userId_2 && p.courseId === courseId_2; });
            if (existingProgress && existingProgress.status !== 'not-started') {
                return [2 /*return*/, res.status(400).json({
                        error: 'You have already started this course',
                        progress: existingProgress
                    })];
            }
            newProgress = {
                id: (0, uuid_1.v4)(),
                userId: userId_2,
                courseId: courseId_2,
                status: 'in-progress',
                progress: 0,
                startedAt: new Date().toISOString()
            };
            if (existingProgress) {
                // Update existing record
                Object.assign(existingProgress, newProgress);
            }
            else {
                // Add new record
                employeeTrainingProgress.push(newProgress);
            }
            res.status(201).json(newProgress);
        }
        catch (error) {
            console.error('Error starting training course:', error);
            res.status(500).json({ error: 'Failed to start training course' });
        }
        return [2 /*return*/];
    });
}); });
// Update training progress
router.put('/update-progress', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_3, _a, courseId_3, moduleId, progress, existingProgress, expirationDate;
    return __generator(this, function (_b) {
        try {
            userId_3 = (0, auth_js_1.extractUserId)(req);
            if (!userId_3) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            _a = req.body, courseId_3 = _a.courseId, moduleId = _a.moduleId, progress = _a.progress;
            if (!courseId_3 || !moduleId || progress === undefined) {
                return [2 /*return*/, res.status(400).json({ error: 'Course ID, module ID, and progress are required' })];
            }
            existingProgress = employeeTrainingProgress.find(function (p) { return p.userId === userId_3 && p.courseId === courseId_3; });
            if (!existingProgress) {
                return [2 /*return*/, res.status(404).json({ error: 'No training progress found for this course' })];
            }
            // Update progress
            existingProgress.progress = Math.max(existingProgress.progress, progress);
            // Update status if needed
            if (progress >= 100) {
                existingProgress.status = 'completed';
                existingProgress.completedAt = new Date().toISOString();
                expirationDate = new Date();
                expirationDate.setFullYear(expirationDate.getFullYear() + 1);
                existingProgress.certificationExpiresAt = expirationDate.toISOString();
            }
            res.json(existingProgress);
        }
        catch (error) {
            console.error('Error updating training progress:', error);
            res.status(500).json({ error: 'Failed to update training progress' });
        }
        return [2 /*return*/];
    });
}); });
// Submit quiz results
router.post('/submit-quiz', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_4, _a, courseId_4, quizId_1, answers_1, course, quiz, moduleWithQuiz, _i, _b, module_1, foundQuiz, correctAnswers_1, score, passed, existingProgress, existingQuizResult;
    return __generator(this, function (_c) {
        try {
            userId_4 = (0, auth_js_1.extractUserId)(req);
            if (!userId_4) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            _a = req.body, courseId_4 = _a.courseId, quizId_1 = _a.quizId, answers_1 = _a.answers;
            if (!courseId_4 || !quizId_1 || !answers_1) {
                return [2 /*return*/, res.status(400).json({ error: 'Course ID, quiz ID, and answers are required' })];
            }
            course = trainingCourses.find(function (c) { return c.id === courseId_4; });
            if (!course) {
                return [2 /*return*/, res.status(404).json({ error: 'Training course not found' })];
            }
            quiz = void 0;
            moduleWithQuiz = void 0;
            for (_i = 0, _b = course.modules; _i < _b.length; _i++) {
                module_1 = _b[_i];
                if (module_1.quizzes) {
                    foundQuiz = module_1.quizzes.find(function (q) { return q.id === quizId_1; });
                    if (foundQuiz) {
                        quiz = foundQuiz;
                        moduleWithQuiz = module_1;
                        break;
                    }
                }
            }
            if (!quiz) {
                return [2 /*return*/, res.status(404).json({ error: 'Quiz not found in this course' })];
            }
            correctAnswers_1 = 0;
            quiz.questions.forEach(function (question, index) {
                if (answers_1[index] === question.correctAnswerIndex) {
                    correctAnswers_1++;
                }
            });
            score = Math.round((correctAnswers_1 / quiz.questions.length) * 100);
            passed = score >= quiz.passingScore;
            existingProgress = employeeTrainingProgress.find(function (p) { return p.userId === userId_4 && p.courseId === courseId_4; });
            if (!existingProgress) {
                return [2 /*return*/, res.status(404).json({ error: 'No training progress found for this course' })];
            }
            // Update quiz results
            if (!existingProgress.quizResults) {
                existingProgress.quizResults = [];
            }
            existingQuizResult = existingProgress.quizResults.find(function (r) { return r.quizId === quizId_1; });
            if (existingQuizResult) {
                existingQuizResult.score = score;
                existingQuizResult.passed = passed;
                existingQuizResult.attemptCount += 1;
                existingQuizResult.lastAttemptAt = new Date().toISOString();
            }
            else {
                existingProgress.quizResults.push({
                    quizId: quizId_1,
                    score: score,
                    passed: passed,
                    attemptCount: 1,
                    lastAttemptAt: new Date().toISOString()
                });
            }
            // Return result
            res.json({
                score: score,
                passed: passed,
                requiredScore: quiz.passingScore,
                feedback: passed
                    ? 'Congratulations! You passed the quiz.'
                    : "You didn't reach the passing score of ".concat(quiz.passingScore, "%. Please review the module and try again."),
                progress: existingProgress
            });
        }
        catch (error) {
            console.error('Error submitting quiz:', error);
            res.status(500).json({ error: 'Failed to submit quiz' });
        }
        return [2 /*return*/];
    });
}); });
// Get all booking policies
router.get('/policies', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            res.json(bookingPolicies);
        }
        catch (error) {
            console.error('Error fetching booking policies:', error);
            res.status(500).json({ error: 'Failed to fetch booking policies' });
        }
        return [2 /*return*/];
    });
}); });
// Acknowledge a policy
router.post('/acknowledge-policy', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, policyId_1, policy, acknowledgment;
    return __generator(this, function (_a) {
        try {
            userId = (0, auth_js_1.extractUserId)(req);
            if (!userId) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            policyId_1 = req.body.policyId;
            if (!policyId_1) {
                return [2 /*return*/, res.status(400).json({ error: 'Policy ID is required' })];
            }
            policy = bookingPolicies.find(function (p) { return p.id === policyId_1; });
            if (!policy) {
                return [2 /*return*/, res.status(404).json({ error: 'Policy not found' })];
            }
            acknowledgment = {
                id: (0, uuid_1.v4)(),
                userId: userId,
                policyId: policyId_1,
                acknowledgedAt: new Date().toISOString(),
                version: policy.version
            };
            res.status(201).json(acknowledgment);
        }
        catch (error) {
            console.error('Error acknowledging policy:', error);
            res.status(500).json({ error: 'Failed to acknowledge policy' });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
