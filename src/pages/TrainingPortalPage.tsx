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
  const [employeeList, setEmployeeList] = useState<{ id: number; name: string; email: string }[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

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
  }, [currentUser]);

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
        <h2 className="text-xl font-semibold mb-4">Available Training Modules</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map(module => (
            <div
              key={module.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
              data-testid={`training-module-${module.id}`}
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold">{module.title}</h3>
                <p className="text-gray-600 mt-1">{module.description}</p>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${module.completionPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
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
                      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                      data-testid={`start-module-${module.id}`}
                    >
                      Start Training
                    </button>
                  ) : module.status === 'in-progress' ? (
                    <button
                      onClick={() => handleContinueModule(module.id)}
                      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                      data-testid={`continue-module-${module.id}`}
                    >
                      Continue Training
                    </button>
                  ) : (
                    <div className="text-center">
                      <span className="text-green-600 font-medium">
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
      <div className="module-content bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-4">{selectedModule.title}</h2>
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
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Back to Modules
          </button>
          <button
            onClick={() => handleCompleteModule(selectedModule.id)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
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
      <div className="admin-controls bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6">
        <h2 className="text-xl font-semibold mb-4">Admin Controls</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowAssignModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            data-testid="assign-training-btn"
          >
            Assign Training
          </button>
          <button
            onClick={handleGenerateReport}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            data-testid="generate-report-btn"
          >
            Generate Certification Report
          </button>
        </div>
      </div>
    );
  };

  const renderAssignModal = () => {
    if (!showAssignModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Assign Training Modules</h2>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Select Employees</h3>
            <div className="space-y-2">
              {employeeList.map(employee => (
                <div key={employee.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`employee-${employee.id}`}
                    className="mr-2"
                    data-testid={`employee-checkbox-${employee.id}`}
                  />
                  <label htmlFor={`employee-${employee.id}`}>
                    {employee.name} ({employee.email})
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Select Modules</h3>
            <div className="space-y-2">
              {modules.map(module => (
                <div key={module.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`module-${module.id}`}
                    className="mr-2"
                    data-testid={`module-checkbox-${module.id}`}
                  />
                  <label htmlFor={`module-${module.id}`}>{module.title}</label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowAssignModal(false)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={() => handleAssignTraining([1, 2], ['module-1', 'module-2'])}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
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
    <div className="training-portal min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Employee Training Portal</h1>
        
        {selectedModule ? renderSelectedModule() : renderModuleList()}
        
        {renderAdminControls()}
        {renderAssignModal()}
      </div>
    </div>
  );
};

export default TrainingPortalPage;
