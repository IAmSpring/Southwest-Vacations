import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { TrainingCourse, EmployeeTraining } from '../sharedTypes';
import { getCourses, getTrainingProgress } from '../api/training';

const TrainingPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [myProgress, setMyProgress] = useState<EmployeeTraining[]>([]);
  const [activeTab, setActiveTab] = useState<'required' | 'all' | 'certified' | 'inProgress'>(
    'all'
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch training data on component mount
  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch courses and progress data from API
        const [coursesData, progressData] = await Promise.all([
          getCourses(),
          getTrainingProgress(),
        ]);

        setCourses(coursesData);
        setMyProgress(progressData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching training data:', error);
        setError('Failed to load training data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchTrainingData();
  }, []);

  // Get progress for a course
  const getProgressForCourse = (courseId: string): EmployeeTraining | undefined => {
    return myProgress.find(p => p.courseId === courseId);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter courses based on active tab
  const getFilteredCourses = () => {
    if (activeTab === 'all') {
      return courses;
    }

    if (activeTab === 'required') {
      return courses.filter(course => course.category === 'required');
    }

    if (activeTab === 'certified') {
      const completedCourseIds = myProgress
        .filter(p => p.status === 'completed')
        .map(p => p.courseId);

      return courses.filter(course => completedCourseIds.includes(course.id));
    }

    if (activeTab === 'inProgress') {
      const inProgressCourseIds = myProgress
        .filter(p => p.status === 'in-progress')
        .map(p => p.courseId);

      return courses.filter(course => inProgressCourseIds.includes(course.id));
    }

    return courses;
  };

  // Handle starting a course
  const handleStartCourse = (courseId: string) => {
    navigate(`/training/course/${courseId}`);
  };

  // Handle continuing a course
  const handleContinueCourse = (courseId: string) => {
    navigate(`/training/course/${courseId}`);
  };

  return (
    <>
      <Helmet>
        <title>Training Portal | Southwest Vacations</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 overflow-hidden rounded-lg bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg">
          <div className="p-6 md:p-8">
            <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">
              Southwest Vacations Training Portal
            </h1>
            <p className="max-w-3xl text-blue-100">
              Complete required training and certifications to ensure you're up to date with the
              latest policies and procedures.
            </p>
            <div className="mt-4">
              <Link
                to="/policies"
                className="inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-blue-800 shadow-sm hover:bg-blue-50"
              >
                View Booking Policies
              </Link>
            </div>
          </div>

          {/* Training Stats */}
          <div className="border-t border-blue-900 bg-white px-6 py-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-blue-50 p-4">
                <h3 className="text-sm font-medium text-blue-700">Total Courses</h3>
                <p className="text-2xl font-bold text-blue-900">{courses.length}</p>
              </div>

              <div className="rounded-lg bg-green-50 p-4">
                <h3 className="text-sm font-medium text-green-700">Completed</h3>
                <p className="text-2xl font-bold text-green-900">
                  {myProgress.filter(p => p.status === 'completed').length}
                </p>
              </div>

              <div className="rounded-lg bg-yellow-50 p-4">
                <h3 className="text-sm font-medium text-yellow-700">In Progress</h3>
                <p className="text-2xl font-bold text-yellow-900">
                  {myProgress.filter(p => p.status === 'in-progress').length}
                </p>
              </div>

              <div className="rounded-lg bg-red-50 p-4">
                <h3 className="text-sm font-medium text-red-700">Not Started</h3>
                <p className="text-2xl font-bold text-red-900">
                  {myProgress.filter(p => p.status === 'not-started').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Filters */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4">
              <button
                className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium ${
                  activeTab === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('all')}
              >
                All Courses
              </button>

              <button
                className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium ${
                  activeTab === 'required'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('required')}
              >
                Required
              </button>

              <button
                className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium ${
                  activeTab === 'inProgress'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('inProgress')}
              >
                In Progress
              </button>

              <button
                className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium ${
                  activeTab === 'certified'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('certified')}
              >
                Completed
              </button>
            </nav>
          </div>
        </div>

        {/* Course Listings */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>
        ) : getFilteredCourses().length === 0 ? (
          <div className="rounded-md bg-gray-50 p-12 text-center">
            <p className="text-lg text-gray-500">No courses found matching your current filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getFilteredCourses().map(course => {
              const progress = getProgressForCourse(course.id);
              return (
                <div
                  key={course.id}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md"
                >
                  <div className="border-b border-gray-200 p-4">
                    <div className="flex items-start justify-between">
                      <h2 className="flex-1 text-lg font-medium text-gray-900">{course.title}</h2>
                      <span
                        className={`ml-2 rounded-full px-2 py-1 text-xs font-medium ${
                          course.category === 'required'
                            ? 'bg-red-100 text-red-800'
                            : course.category === 'certification'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {course.category === 'required'
                          ? 'Required'
                          : course.category === 'certification'
                            ? 'Certification'
                            : 'Optional'}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          course.level === 'beginner'
                            ? 'bg-green-100 text-green-800'
                            : course.level === 'intermediate'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {Math.floor(course.duration / 60)} hours {course.duration % 60} min
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-gray-600">{course.description}</p>
                  </div>

                  <div className="p-4">
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {progress
                            ? progress.status === 'completed'
                              ? 'Completed'
                              : progress.status === 'in-progress'
                                ? 'In Progress'
                                : 'Not Started'
                            : 'Not Started'}
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {progress ? `${progress.progress}%` : '0%'}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full ${
                            progress?.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${progress?.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Certification Status */}
                    {progress?.status === 'completed' && progress.certificationExpiresAt && (
                      <div className="mb-4 rounded bg-green-50 p-2 text-sm">
                        <div className="font-medium text-green-800">Certification Valid</div>
                        <div className="text-green-700">
                          Expires: {formatDate(progress.certificationExpiresAt)}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="mt-2">
                      {!progress || progress.status === 'not-started' ? (
                        <button
                          onClick={() => handleStartCourse(course.id)}
                          className="w-full rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                        >
                          Start Course
                        </button>
                      ) : progress.status === 'in-progress' ? (
                        <button
                          onClick={() => handleContinueCourse(course.id)}
                          className="w-full rounded bg-yellow-600 px-4 py-2 text-white transition hover:bg-yellow-700"
                        >
                          Continue ({progress.progress}% Complete)
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartCourse(course.id)}
                          className="w-full rounded bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                        >
                          Review Course
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Upcoming Deadlines Section */}
        <div className="mt-12 overflow-hidden rounded-lg bg-white shadow-md">
          <div className="border-b border-yellow-100 bg-yellow-50 px-6 py-4">
            <h2 className="text-lg font-medium text-yellow-800">
              Upcoming Certification Deadlines
            </h2>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {myProgress
                .filter(p => p.status === 'completed' && p.certificationExpiresAt)
                .sort(
                  (a, b) =>
                    new Date(a.certificationExpiresAt!).getTime() -
                    new Date(b.certificationExpiresAt!).getTime()
                )
                .slice(0, 3)
                .map(p => {
                  const course = courses.find(c => c.id === p.courseId);
                  const daysRemaining = Math.ceil(
                    (new Date(p.certificationExpiresAt!).getTime() - Date.now()) /
                      (1000 * 60 * 60 * 24)
                  );

                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-md bg-gray-50 p-4"
                    >
                      <div>
                        <h3 className="font-medium">{course?.title || 'Unknown Course'}</h3>
                        <p className="text-sm text-gray-500">
                          Expires: {formatDate(p.certificationExpiresAt!)}
                        </p>
                      </div>

                      <div
                        className={`text-sm font-medium ${
                          daysRemaining < 30
                            ? 'text-red-600'
                            : daysRemaining < 90
                              ? 'text-yellow-600'
                              : 'text-green-600'
                        }`}
                      >
                        {daysRemaining} days remaining
                      </div>
                    </div>
                  );
                })}

              {myProgress.filter(p => p.status === 'completed' && p.certificationExpiresAt)
                .length === 0 && (
                <p className="py-4 text-center text-gray-500">
                  No upcoming certification deadlines.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Booking Policies Section */}
        <div className="mt-12 overflow-hidden rounded-lg bg-white shadow-md">
          <div className="border-b border-blue-100 bg-blue-50 px-6 py-4">
            <h2 className="text-lg font-medium text-blue-800">Booking Policies</h2>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div className="rounded-lg border p-4 transition hover:bg-gray-50">
                <div className="flex justify-between">
                  <h3 className="font-medium">General Booking Terms & Conditions</h3>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    v2.1
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  These terms and conditions govern all bookings made through Southwest Vacations...
                </p>
                <div className="mt-4 flex justify-end">
                  <Link
                    to="/policies/general"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    View Policy
                  </Link>
                </div>
              </div>

              <div className="rounded-lg border p-4 transition hover:bg-gray-50">
                <div className="flex justify-between">
                  <h3 className="font-medium">Refund & Cancellation Policy</h3>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    v3.2
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Customers may cancel their booking and receive a full refund within 24 hours of
                  booking...
                </p>
                <div className="mt-4 flex justify-end">
                  <Link
                    to="/policies/refunds"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    View Policy
                  </Link>
                </div>
              </div>

              <div className="rounded-lg border p-4 transition hover:bg-gray-50">
                <div className="flex justify-between">
                  <h3 className="font-medium">Multi-destination Booking Guidelines</h3>
                  <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                    v1.5 - Updated
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  When booking multi-destination itineraries, each segment must have valid
                  connecting options...
                </p>
                <div className="mt-4 flex justify-end">
                  <Link
                    to="/policies/multi-destination"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    View Policy
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Link
                to="/policies"
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                View All Policies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrainingPortalPage;
