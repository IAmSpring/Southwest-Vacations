import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { TrainingCourse, TrainingModule, Quiz, QuizQuestion } from '../sharedTypes';
import {
  getCourseById,
  updateTrainingProgress,
  submitQuizResults,
  completeCourse,
  getCourseProgress,
} from '../api/training';

const CourseStudyPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<TrainingCourse | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizResults, setQuizResults] = useState<{
    score: number;
    passed: boolean;
    feedback: string;
  } | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!courseId) {
          setError('Course ID is missing');
          setIsLoading(false);
          return;
        }

        // Fetch course data from API
        const courseData = await getCourseById(courseId);
        setCourse(courseData);

        // Fetch user's course progress
        const progressData = await getCourseProgress(courseId);

        // Set initial progress from API data
        setProgress(progressData.progress || 0);

        // If there's a moduleId in the progress data, set the current module index
        if (progressData.moduleId && courseData.modules) {
          const moduleIndex = courseData.modules.findIndex(m => m.id === progressData.moduleId);
          if (moduleIndex > -1) {
            setCurrentModuleIndex(moduleIndex);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching course:', error);
        setError('Failed to load course. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Get current module
  const currentModule = course?.modules[currentModuleIndex] || null;

  // Handle module navigation
  const goToNextModule = async () => {
    if (!course) return;

    try {
      const currentModule = course.modules[currentModuleIndex];
      const nextModuleIndex = currentModuleIndex + 1;

      // Calculate new progress percentage
      const totalModules = course.modules.length;
      const newProgress = Math.min(
        Math.round((nextModuleIndex / totalModules) * 100),
        99 // Cap at 99% until course is fully completed
      );

      // Update progress in API
      await updateTrainingProgress(course.id, {
        progress: newProgress,
        status: 'in-progress',
        moduleId:
          nextModuleIndex < totalModules ? course.modules[nextModuleIndex].id : currentModule.id,
      });

      // Check if module has a quiz
      if (currentModule.quizzes && currentModule.quizzes.length > 0) {
        setQuizAnswers(new Array(currentModule.quizzes[0].questions.length).fill(-1));
        setQuizResults(null);
        setShowQuiz(true);
      } else if (nextModuleIndex < course.modules.length) {
        // Move to next module if no quiz
        setCurrentModuleIndex(nextModuleIndex);
        setProgress(newProgress);
      } else {
        // Course completed
        setShowCompletion(true);
        setProgress(100);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      // Still allow UI to proceed even if API update fails

      const nextModuleIndex = currentModuleIndex + 1;
      const currentModule = course.modules[currentModuleIndex];

      if (currentModule.quizzes && currentModule.quizzes.length > 0) {
        setQuizAnswers(new Array(currentModule.quizzes[0].questions.length).fill(-1));
        setQuizResults(null);
        setShowQuiz(true);
      } else if (nextModuleIndex < course.modules.length) {
        setCurrentModuleIndex(nextModuleIndex);
      } else {
        setShowCompletion(true);
      }
    }
  };

  const goToPreviousModule = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
      setQuizResults(null);
      setShowQuiz(false);
    }
  };

  // Handle quiz answer selection
  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  // Handle quiz submission
  const handleQuizSubmit = async () => {
    if (!course) return;

    const currentModule = course.modules[currentModuleIndex];
    const quiz = currentModule.quizzes?.[0];

    if (!quiz) return;

    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (quizAnswers[index] === question.correctAnswerIndex) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    try {
      // Submit quiz results to API
      await submitQuizResults(course.id, quiz.id, {
        score,
        passed,
        answers: quizAnswers,
      });

      // Update local state with results
      setQuizResults({
        score,
        passed,
        feedback: passed
          ? 'Congratulations! You passed the quiz.'
          : `You didn't meet the passing score of ${quiz.passingScore}%. Please review the material and try again.`,
      });

      // If passed, update progress and move to next module
      if (passed) {
        const nextModuleIndex = currentModuleIndex + 1;

        // Calculate new progress percentage
        const totalModules = course.modules.length;
        const newProgress = Math.min(
          Math.round((nextModuleIndex / totalModules) * 100),
          99 // Cap at 99% until course is fully completed
        );

        // Update progress in API
        await updateTrainingProgress(course.id, {
          progress: newProgress,
          status: 'in-progress',
          moduleId: nextModuleIndex < totalModules ? course.modules[nextModuleIndex].id : null,
        });

        setProgress(newProgress);
      }
    } catch (error) {
      console.error('Error submitting quiz results:', error);

      // Still update local state even if API call fails
      setQuizResults({
        score,
        passed,
        feedback: passed
          ? 'Congratulations! You passed the quiz.'
          : `You didn't meet the passing score of ${quiz.passingScore}%. Please review the material and try again.`,
      });
    }
  };

  // Handle retrying the quiz
  const handleRetryQuiz = () => {
    setQuizAnswers([]);
    setQuizResults(null);
  };

  // Handle completing the course
  const handleCompleteCourse = async () => {
    if (!course) return;

    try {
      // Mark course as completed in API
      await completeCourse(course.id);

      // Update progress to 100%
      setProgress(100);

      // Navigate back to training portal
      navigate('/training');
    } catch (error) {
      console.error('Error completing course:', error);
      // Still navigate back even if API call fails
      navigate('/training');
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {course ? `${course.title} | Training Portal` : 'Course Study | Training Portal'}
        </title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Links */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center text-sm text-gray-600">
            <Link to="/training" className="hover:text-blue-600">
              Training Portal
            </Link>
            <span className="mx-2">›</span>
            <span className="text-gray-800">{course?.title || 'Loading Course...'}</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>
        ) : course ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Course Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 overflow-hidden rounded-lg bg-white shadow-md">
                <div className="border-b border-blue-100 bg-blue-50 p-4">
                  <h2 className="font-bold text-gray-900">{course.title}</h2>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </span>
                    <span className="ml-2 text-gray-500">
                      {Math.floor(course.duration / 60)}h {course.duration % 60}m
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-4">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Course Progress</span>
                      <span className="text-sm font-medium text-gray-700">{progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <div className="h-full bg-blue-500" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>

                  <h3 className="mb-2 font-medium text-gray-900">Modules</h3>
                  <ul className="space-y-1">
                    {course.modules.map((module, index) => (
                      <li key={module.id}>
                        <button
                          onClick={() => {
                            setCurrentModuleIndex(index);
                            setQuizResults(null);
                            setShowQuiz(false);
                            setShowCompletion(false);
                          }}
                          className={`w-full rounded px-3 py-2 text-left text-sm ${
                            currentModuleIndex === index
                              ? 'bg-blue-100 font-medium text-blue-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="mr-2 flex-shrink-0">{index + 1}.</span>
                            <span className="truncate">{module.title}</span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Course Content */}
            <div className="lg:col-span-3">
              <div className="overflow-hidden rounded-lg bg-white shadow-md">
                {showCompletion ? (
                  <div className="p-8 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                      <svg
                        className="h-10 w-10 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h2 className="mb-2 text-2xl font-bold text-gray-900">Course Completed!</h2>
                    <p className="mb-6 text-gray-600">
                      Congratulations on completing {course.title}. You've successfully finished all
                      modules and passed all quizzes.
                    </p>
                    <div className="mb-6 inline-block rounded-lg bg-blue-50 p-4">
                      <p className="font-medium text-blue-800">
                        Your certification is valid for 1 year from today.
                      </p>
                    </div>
                    <button
                      onClick={handleCompleteCourse}
                      className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                    >
                      Return to Training Portal
                    </button>
                  </div>
                ) : showQuiz && currentModule?.quizzes ? (
                  <div className="p-6">
                    <div className="mb-6">
                      <h2 className="mb-2 text-xl font-bold text-gray-900">Module Quiz</h2>
                      <p className="text-gray-600">
                        Complete this quiz to test your knowledge of {currentModule.title}.
                        {currentModule.quizzes[0].passingScore && (
                          <span> You need {currentModule.quizzes[0].passingScore}% to pass.</span>
                        )}
                      </p>
                    </div>

                    {quizResults ? (
                      <div
                        className={`mb-8 rounded-lg p-4 ${
                          quizResults.passed
                            ? 'border border-green-200 bg-green-50'
                            : 'border border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex items-start">
                          {quizResults.passed ? (
                            <svg
                              className="mr-2 mt-0.5 h-5 w-5 text-green-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="mr-2 mt-0.5 h-5 w-5 text-red-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          )}
                          <div>
                            <h3
                              className={`font-medium ${quizResults.passed ? 'text-green-800' : 'text-red-800'}`}
                            >
                              {quizResults.passed ? 'Quiz Passed!' : 'Quiz Failed'}
                            </h3>
                            <p
                              className={`mt-1 text-sm ${quizResults.passed ? 'text-green-700' : 'text-red-700'}`}
                            >
                              Your score: {quizResults.score}%
                            </p>
                            <p
                              className={`mt-2 text-sm ${quizResults.passed ? 'text-green-700' : 'text-red-700'}`}
                            >
                              {quizResults.feedback}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          {quizResults.passed ? (
                            <button
                              onClick={goToNextModule}
                              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                            >
                              Continue
                            </button>
                          ) : (
                            <button
                              onClick={handleRetryQuiz}
                              className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
                            >
                              Try Again
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {currentModule.quizzes[0].questions.map((question, questionIndex) => (
                          <div key={question.id} className="rounded-lg border border-gray-200 p-4">
                            <h3 className="mb-3 font-medium text-gray-900">
                              {questionIndex + 1}. {question.question}
                            </h3>
                            <div className="space-y-2">
                              {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center">
                                  <input
                                    id={`question-${questionIndex}-option-${optionIndex}`}
                                    type="radio"
                                    name={`question-${questionIndex}`}
                                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={quizAnswers[questionIndex] === optionIndex}
                                    onChange={() => handleAnswerSelect(questionIndex, optionIndex)}
                                  />
                                  <label
                                    htmlFor={`question-${questionIndex}-option-${optionIndex}`}
                                    className="ml-3 block text-sm text-gray-700"
                                  >
                                    {option}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}

                        <div className="flex justify-end">
                          <button
                            onClick={handleQuizSubmit}
                            disabled={
                              quizAnswers.length !== currentModule.quizzes[0].questions.length
                            }
                            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                          >
                            Submit Quiz
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : currentModule ? (
                  <div className="p-6">
                    <div className="mb-6">
                      <h2 className="mb-2 text-xl font-bold text-gray-900">
                        {currentModule.title}
                      </h2>
                      <div className="text-sm text-gray-500">
                        Estimated time: {currentModule.timeToComplete} minutes
                      </div>
                    </div>

                    <div
                      className="prose mb-8 max-w-none"
                      dangerouslySetInnerHTML={{ __html: currentModule.content }}
                    />

                    {currentModule.resourceLinks && currentModule.resourceLinks.length > 0 && (
                      <div className="mb-8 rounded-lg bg-gray-50 p-4">
                        <h3 className="mb-2 font-medium text-gray-900">Additional Resources</h3>
                        <ul className="space-y-1">
                          {currentModule.resourceLinks.map((link, index) => (
                            <li key={index}>
                              <a
                                href={link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                {link.split('/').pop()}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <button
                        onClick={goToPreviousModule}
                        disabled={currentModuleIndex === 0}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                      >
                        <svg
                          className="mr-2 h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                          />
                        </svg>
                        Previous
                      </button>

                      <button
                        onClick={goToNextModule}
                        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        {currentModuleIndex === course.modules.length - 1
                          ? 'Complete Course'
                          : currentModule.quizzes && currentModule.quizzes.length > 0
                            ? 'Take Quiz'
                            : 'Next'}
                        <svg
                          className="ml-2 h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default CourseStudyPage;
