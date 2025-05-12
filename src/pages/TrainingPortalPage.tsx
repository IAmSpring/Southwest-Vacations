import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  completionPercentage: number;
  certificationDate?: string;
}

const TrainingPortalPage: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuthContext();
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [employeeList, setEmployeeList] = useState<{ id: number; name: string; email: string }[]>(
    []
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (currentUser && currentUser.role === 'admin') {
      setIsAdmin(true);
    }

    // Mock data - in a real app, this would come from an API
    const mockModules: TrainingModule[] = [
      {
        id: 'module-1',
        title: 'Customer Service Basics',
        description: 'Learn the fundamentals of providing excellent customer service.',
        status: 'completed',
        completionPercentage: 100,
        certificationDate: '2023-10-15',
      },
      {
        id: 'module-2',
        title: 'Booking System Training',
        description: 'Master the Southwest Vacations booking platform.',
        status: 'in-progress',
        completionPercentage: 60,
      },
      {
        id: 'module-3',
        title: 'Travel Package Upselling',
        description: 'Techniques for recommending premium travel packages.',
        status: 'not-started',
        completionPercentage: 0,
      },
      {
        id: 'module-4',
        title: 'Conflict Resolution',
        description: 'Handle difficult customer situations with professionalism.',
        status: 'not-started',
        completionPercentage: 0,
      },
      {
        id: 'module-5',
        title: 'Travel Insurance Policies',
        description: 'Understanding and explaining travel insurance options.',
        status: 'not-started',
        completionPercentage: 0,
      },
    ];

    // Mock employee data for admin users
    const mockEmployees = [
      { id: 1, name: 'John Smith', email: 'john@example.com' },
      { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com' },
      { id: 3, name: 'Michael Brown', email: 'michael@example.com' },
      { id: 4, name: 'Jessica Davis', email: 'jessica@example.com' },
    ];

    setModules(mockModules);
    setEmployeeList(mockEmployees);
  }, [currentUser]); // Only depends on currentUser

  // Check if user is authenticated - moved after hooks
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleStartModule = (moduleId: string) => {
    setModules(prevModules =>
      prevModules.map(mod =>
        mod.id === moduleId
          ? { ...mod, status: 'in-progress' as const, completionPercentage: 10 }
          : mod
      )
    );

    const moduleToStart = modules.find(m => m.id === moduleId) || null;
    if (moduleToStart) {
      setSelectedModule(moduleToStart);
    }
  };

  const handleContinueModule = (moduleId: string) => {
    const moduleToResume = modules.find(m => m.id === moduleId) || null;
    if (moduleToResume) {
      setSelectedModule(moduleToResume);
    }
  };

  const handleCompleteModule = (moduleId: string) => {
    const today = new Date().toISOString().split('T')[0];

    setModules(prevModules =>
      prevModules.map(mod =>
        mod.id === moduleId
          ? {
              ...mod,
              status: 'completed' as const,
              completionPercentage: 100,
              certificationDate: today,
            }
          : mod
      )
    );

    setSelectedModule(null);
  };

  const handleAssignTraining = (employeeIds: number[], moduleIds: string[]) => {
    alert(`Training modules assigned to selected employees`);
    setShowAssignModal(false);
  };

  const handleGenerateReport = () => {
    // In a real app, this would call an API endpoint to generate a report
    alert('Certification report generated successfully.');
  };

  const renderModuleList = () => {
    return (
      <div className="module-list">
        <h2 className="mb-4 text-xl font-semibold">Available Training Modules</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map(module => (
            <div
              key={module.id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md"
              data-testid={`training-module-${module.id}`}
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold">{module.title}</h3>
                <p className="mt-1 text-gray-600">{module.description}</p>
                <div className="mt-3">
                  <div className="h-2.5 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2.5 rounded-full bg-blue-600"
                      style={{ width: `${module.completionPercentage}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 flex justify-between">
                    <span className="text-sm text-gray-500">
                      {module.completionPercentage}% Complete
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {module.status === 'not-started' && 'Not Started'}
                      {module.status === 'in-progress' && 'In Progress'}
                      {module.status === 'completed' && 'Completed'}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  {module.status === 'not-started' ? (
                    <button
                      onClick={() => handleStartModule(module.id)}
                      className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
                      data-testid={`start-module-${module.id}`}
                    >
                      Start Training
                    </button>
                  ) : module.status === 'in-progress' ? (
                    <button
                      onClick={() => handleContinueModule(module.id)}
                      className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
                      data-testid={`continue-module-${module.id}`}
                    >
                      Continue Training
                    </button>
                  ) : (
                    <div className="text-center">
                      <span className="font-medium text-green-600">
                        Certified on {module.certificationDate}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSelectedModule = () => {
    if (!selectedModule) return null;

    return (
      <div className="module-content rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-bold">{selectedModule.title}</h2>
        <div className="mb-6">
          <p className="text-gray-700">
            This is the content for the {selectedModule.title} training module. In a real
            application, this would include videos, interactive exercises, quizzes, and other
            training materials.
          </p>
        </div>
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setSelectedModule(null)}
            className="rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
          >
            Back to Modules
          </button>
          <button
            onClick={() => handleCompleteModule(selectedModule.id)}
            className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            data-testid={`complete-module-${selectedModule.id}`}
          >
            Mark as Complete
          </button>
        </div>
      </div>
    );
  };

  const renderAdminControls = () => {
    if (!isAdmin) return null;

    return (
      <div className="admin-controls mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Admin Controls</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowAssignModal(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            data-testid="assign-training-btn"
          >
            Assign Training
          </button>
          <button
            onClick={handleGenerateReport}
            className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            data-testid="generate-report-btn"
          >
            Generate Report
          </button>
        </div>
      </div>
    );
  };

  const renderAssignModal = () => {
    if (!showAssignModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Assign Training</h2>
          <div className="mb-4">
            <label className="mb-2 block text-gray-700">Select Employees</label>
            <select
              multiple
              className="h-32 w-full rounded-md border border-gray-300 p-2"
              data-testid="employee-select"
            >
              {employeeList.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} ({employee.email})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-gray-700">Select Modules</label>
            <select
              multiple
              className="h-32 w-full rounded-md border border-gray-300 p-2"
              data-testid="module-select"
            >
              {modules.map(module => (
                <option key={module.id} value={module.id}>
                  {module.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowAssignModal(false)}
              className="rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={() => handleAssignTraining([1, 2], ['module-1', 'module-2'])}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              data-testid="confirm-assign-btn"
            >
              Assign
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Training Portal</h1>
      {selectedModule ? (
        renderSelectedModule()
      ) : (
        <div>
          {renderModuleList()}
          {renderAdminControls()}
          {renderAssignModal()}
        </div>
      )}
    </div>
  );
};

export default TrainingPortalPage;
