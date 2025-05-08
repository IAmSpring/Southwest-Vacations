import React, { useState } from 'react';
import { runAllTests } from '../utils/systemTests';

type TestResults = {
  success: boolean;
  results: { [name: string]: boolean };
};

const SystemCheck: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResults | null>(null);

  const handleRunTests = async () => {
    setIsRunning(true);
    setResults(null);
    
    try {
      const testResults = await runAllTests();
      setResults(testResults);
    } catch (error) {
      console.error('Error running tests:', error);
      setResults({
        success: false,
        results: {
          error: false
        }
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="system-check">
      <h2>System Check</h2>
      <div className="system-check-container">
        <p>
          This tool checks if your frontend and backend are properly configured and connected.
          It verifies API connectivity, authentication, and booking functionality.
        </p>
        
        <button 
          onClick={handleRunTests} 
          disabled={isRunning}
          className="primary-button"
        >
          {isRunning ? 'Running Tests...' : 'Run System Check'}
        </button>
        
        {results && (
          <div className="test-results">
            <h3>Test Results</h3>
            
            <div className={`overall-result ${results.success ? 'success' : 'error'}`}>
              {results.success ? '✅ All tests passed!' : '❌ Some tests failed'}
            </div>
            
            <ul className="test-list">
              {Object.entries(results.results).map(([name, passed]) => (
                <li key={name} className={passed ? 'success' : 'error'}>
                  {passed ? '✅' : '❌'} {name.replace(/([A-Z])/g, ' $1').trim()}
                </li>
              ))}
            </ul>
            
            {!results.results.backendConnectivity && (
              <div className="error-help">
                <h4>Backend Connectivity Failed</h4>
                <p>Check that your backend server is running at the expected URL.</p>
                <ul>
                  <li>Make sure you've started the backend server with <code>npm run backend</code></li>
                  <li>Check that the API_URL in your code is correctly configured.</li>
                  <li>Verify no CORS issues are occurring (check browser dev tools).</li>
                </ul>
              </div>
            )}
            
            {results.results.backendConnectivity && !results.results.authentication && (
              <div className="error-help">
                <h4>Authentication Failed</h4>
                <p>Could not authenticate with the server.</p>
                <ul>
                  <li>Ensure the test user exists in the backend database.</li>
                  <li>Check JWT tokens are being properly generated.</li>
                  <li>Verify the auth endpoints are functioning.</li>
                </ul>
              </div>
            )}
            
            {results.results.authentication && !results.results.booking && (
              <div className="error-help">
                <h4>Booking Failed</h4>
                <p>Authentication works, but booking failed.</p>
                <ul>
                  <li>Check if booking endpoints are properly configured.</li>
                  <li>Verify that authentication tokens are being correctly sent with requests.</li>
                  <li>Make sure trip data exists in the backend.</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      
      <style jsx>{`
        .system-check {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .system-check-container {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .primary-button {
          background: #0d6efd;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .primary-button:disabled {
          background: #77a7e0;
          cursor: not-allowed;
        }
        
        .test-results {
          margin-top: 20px;
          border-top: 1px solid #dee2e6;
          padding-top: 20px;
        }
        
        .overall-result {
          font-size: 18px;
          font-weight: 600;
          padding: 12px;
          border-radius: 4px;
          text-align: center;
          margin-bottom: 16px;
        }
        
        .success {
          color: #198754;
        }
        
        .error {
          color: #dc3545;
        }
        
        .test-list {
          list-style: none;
          padding: 0;
        }
        
        .test-list li {
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        
        .error-help {
          margin-top: 20px;
          padding: 16px;
          background: #f8d7da;
          border: 1px solid #f5c2c7;
          border-radius: 4px;
        }
        
        code {
          background: rgba(0,0,0,0.1);
          padding: 2px 4px;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default SystemCheck; 