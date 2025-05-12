import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

interface CourseSection {
  id: string;
  title: string;
  content: string;
  completed: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  sections: CourseSection[];
  progress: number;
}

const CourseStudyPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { isAuthenticated } = useAuthContext();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API call to fetch course details
    const fetchCourseData = () => {
      setLoading(true);

      // Simulate API delay
      setTimeout(() => {
        // This is mock data - in a real app, this would come from an API
        const mockCourse: Course = {
          id: courseId || 'unknown',
          title: courseId === 'module-1' 
            ? 'Customer Service Basics' 
            : courseId === 'module-2'
              ? 'Booking System Training'
              : 'Training Module',
          description: 'Comprehensive training on providing exceptional customer service.',
          progress: 0,
          sections: [
            {
              id: 'section-1',
              title: 'Introduction',
              content: `
                <h2>Introduction to Customer Service</h2>
                <p>Welcome to the Customer Service Basics training module. This course will teach you the fundamental principles of providing excellent customer service at Southwest Vacations.</p>
                <p>In this module, you will learn:</p>
                <ul>
                  <li>Core customer service principles</li>
                  <li>Effective communication techniques</li>
                  <li>Problem-solving strategies</li>
                  <li>Handling difficult situations</li>
                </ul>
                <p>By the end of this course, you'll have the skills needed to provide outstanding service to our customers.</p>
              `,
              completed: false
            },
            {
              id: 'section-2',
              title: 'Communication Skills',
              content: `
                <h2>Effective Communication</h2>
                <p>Communication is the foundation of excellent customer service. This section covers key techniques for clear and effective communication with customers.</p>
                <h3>Active Listening</h3>
                <p>Active listening involves fully concentrating on what the customer is saying, understanding their needs, and responding appropriately.</p>
                <h3>Clear Expression</h3>
                <p>Use simple language and avoid industry jargon when explaining options or policies to customers.</p>
                <h3>Positive Language</h3>
                <p>Focus on what you can do rather than what you can't do. For example, instead of saying "We can't check you in until 3pm," say "We'll be happy to check you in starting at 3pm."</p>
              `,
              completed: false
            },
            {
              id: 'section-3',
              title: 'Problem Solving',
              content: `
                <h2>Problem-Solving Strategies</h2>
                <p>When customers face issues, your ability to solve problems quickly and effectively is crucial.</p>
                <h3>The LAST Approach</h3>
                <ul>
                  <li><strong>L</strong>isten to the customer's concern</li>
                  <li><strong>A</strong>cknowledge their feelings</li>
                  <li><strong>S</strong>olve the problem</li>
                  <li><strong>T</strong>hank them for their patience</li>
                </ul>
                <h3>Empowerment</h3>
                <p>You are empowered to resolve customer issues within the guidelines provided. When in doubt, consult with your supervisor.</p>
              `,
              completed: false
            },
            {
              id: 'section-4',
              title: 'Assessment',
              content: `
                <h2>Course Assessment</h2>
                <p>Complete this assessment to earn your certification in Customer Service Basics.</p>
                <div id="assessment-questions">
                  <div class="question">
                    <p><strong>1. What is the key first step in the LAST problem-solving approach?</strong></p>
                    <div class="options">
                      <div><input type="radio" name="q1" value="a" id="q1a"><label for="q1a">Look for solutions</label></div>
                      <div><input type="radio" name="q1" value="b" id="q1b"><label for="q1b">Listen to the customer</label></div>
                      <div><input type="radio" name="q1" value="c" id="q1c"><label for="q1c">Launch an investigation</label></div>
                    </div>
                  </div>
                  <div class="question">
                    <p><strong>2. When explaining booking options to customers, you should:</strong></p>
                    <div class="options">
                      <div><input type="radio" name="q2" value="a" id="q2a"><label for="q2a">Use technical industry terms to sound professional</label></div>
                      <div><input type="radio" name="q2" value="b" id="q2b"><label for="q2b">Use simple language and avoid jargon</label></div>
                      <div><input type="radio" name="q2" value="c" id="q2c"><label for="q2c">Speak quickly to save time</label></div>
                    </div>
                  </div>
                  <div class="question">
                    <p><strong>3. What is an example of positive language?</strong></p>
                    <div class="options">
                      <div><input type="radio" name="q3" value="a" id="q3a"><label for="q3a">"We can't process refunds after 30 days."</label></div>
                      <div><input type="radio" name="q3" value="b" id="q3b"><label for="q3b">"Unfortunately, there's nothing I can do."</label></div>
                      <div><input type="radio" name="q3" value="c" id="q3c"><label for="q3c">"Refunds are available within 30 days of purchase."</label></div>
                    </div>
                  </div>
                </div>
                <button id="submit-assessment" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Submit Assessment</button>
              `,
              completed: false
            }
          ]
        };

        setCourse(mockCourse);
        setLoading(false);
      }, 1000);
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
        <p>The course you're looking for doesn't exist or has been removed.</p>
        <Link to="/training" className="text-blue-600 hover:underline">
          Return to Training Portal
        </Link>
      </div>
    );
  }

  const currentSection = course.sections[currentSectionIndex];

  const handleNextSection = () => {
    if (currentSectionIndex < course.sections.length - 1) {
      // Mark current section as completed
      const updatedSections = [...course.sections];
      updatedSections[currentSectionIndex].completed = true;
      
      setCourse({
        ...course,
        sections: updatedSections,
        progress: ((currentSectionIndex + 1) / course.sections.length) * 100
      });
      
      setCurrentSectionIndex(currentSectionIndex + 1);
      
      // Scroll to top when moving to next section
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      // Scroll to top when moving to previous section
      window.scrollTo(0, 0);
    }
  };

  const handleCompleteAssessment = () => {
    // Mark all sections as completed
    const completedSections = course.sections.map(section => ({ ...section, completed: true }));
    
    setCourse({
      ...course,
      sections: completedSections,
      progress: 100
    });
    
    // Show completion message
    alert("Congratulations! You've completed the course assessment. Your certificate will be available in your training portal.");
  };

  return (
    <div className="course-study min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/training" className="text-blue-600 hover:underline">
            &larr; Back to Training Portal
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold" data-testid="course-title">{course.title}</h1>
            <p className="text-gray-600 mt-2">{course.description}</p>
          </div>

          <div className="p-4 bg-gray-100 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-grow">
                <div className="w-full bg-gray-300 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="ml-4 whitespace-nowrap">
                <span className="font-medium">{Math.round(course.progress)}% Complete</span>
              </div>
            </div>
          </div>

          <div className="flex border-b border-gray-200">
            <div className="w-1/4 border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto" style={{ maxHeight: '600px' }}>
              <h2 className="font-semibold text-lg mb-4">Course Content</h2>
              <ul className="space-y-2">
                {course.sections.map((section, index) => (
                  <li key={section.id} className="py-1">
                    <button
                      onClick={() => setCurrentSectionIndex(index)}
                      className={`w-full text-left px-3 py-2 rounded ${
                        currentSectionIndex === index
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-200'
                      }`}
                      data-testid={`section-${index + 1}-btn`}
                    >
                      <div className="flex items-center">
                        <span className="flex-grow truncate">{section.title}</span>
                        {section.completed && (
                          <span className="ml-2 text-green-600">✓</span>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-3/4 p-6 overflow-y-auto" style={{ maxHeight: '600px' }}>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: currentSection.content }} />
              
              {currentSectionIndex === course.sections.length - 1 && (
                <div className="mt-6">
                  <button
                    onClick={handleCompleteAssessment}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    data-testid="complete-assessment-btn"
                  >
                    Complete Assessment
                  </button>
                </div>
              )}

              <div className="mt-8 flex justify-between">
                <button
                  onClick={handlePreviousSection}
                  disabled={currentSectionIndex === 0}
                  className={`px-4 py-2 rounded ${
                    currentSectionIndex === 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                  }`}
                >
                  Previous
                </button>
                
                {currentSectionIndex < course.sections.length - 1 && (
                  <button
                    onClick={handleNextSection}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    data-testid="next-section-btn"
                  >
                    Next Section
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseStudyPage;
