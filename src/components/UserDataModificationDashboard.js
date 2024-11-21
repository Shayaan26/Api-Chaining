import React, { useState, useEffect } from 'react';
import { API_CONFIGS } from '../utils/apiConfig';

const UserDataModificationDashboard = () => {
  const [users, setUsers] = useState([]);
  const [workflow, setWorkflow] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchInitialUserData();
  }, []);

  const fetchInitialUserData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data.slice(0, 5));
setResults([{ api: 'Get Users List', data: data.slice(0, 5) }]);
    } catch (error) {
      console.error('Error fetching initial user data:', error);
      setError('Failed to fetch initial user data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addApiToWorkflow = () => {
    setWorkflow([...workflow, { api: '', params: {}, body: {}, dataMapping: {} }]);
  };

  const removeApiFromWorkflow = (index) => {
    const newWorkflow = [...workflow];
    newWorkflow.splice(index, 1);
    setWorkflow(newWorkflow);
  };

  const handleApiChange = (index, selectedApi) => {
    const newWorkflow = [...workflow];
    newWorkflow[index] = {
      api: selectedApi,
      params: {},
      body: {},
      dataMapping: {},
    };
    setWorkflow(newWorkflow);
  };

  const handleParamChange = (index, param, value) => {
    const newWorkflow = [...workflow];
    newWorkflow[index].params[param] = value;
    setWorkflow(newWorkflow);
  };

  const handleBodyChange = (index, field, value) => {
    const newWorkflow = [...workflow];
    newWorkflow[index].body[field] = value;
    setWorkflow(newWorkflow);
  };

  const handleDataMappingChange = (index, field, sourceApi, sourceField) => {
    const newWorkflow = [...workflow];
    newWorkflow[index].dataMapping[field] = { sourceApi, sourceField };
    setWorkflow(newWorkflow);
  };

  const executeWorkflow = async () => {
    setIsLoading(true);
    setError(null);
    let workflowResults = [...results];
    try {
      for (const step of workflow) {
        const apiConfig = API_CONFIGS[step.api];
        if (!apiConfig) continue;

        let url = apiConfig.url;
        let body = { ...step.body };
        let params = { ...step.params };

        // Apply data mapping
        for (const [field, mapping] of Object.entries(step.dataMapping)) {
          const sourceResult = workflowResults.find(r => r.api === mapping.sourceApi);
          if (sourceResult && sourceResult.data) {
            const value = Array.isArray(sourceResult.data)
              ? sourceResult.data.find(item => item.id === parseInt(params.id))?.[mapping.sourceField]
              : sourceResult.data[mapping.sourceField];
            
            if (apiConfig.method === 'GET') {
              params[field] = value;
            } else {
              body[field] = value;
            }
          }
        }

        // Construct URL with params for GET requests
        if (apiConfig.method === 'GET') {
          url += params.id;
        } else if (apiConfig.method === 'PUT') {
          url += body.id;
        }

        const response = await fetch(url, {
          method: apiConfig.method,
          body: apiConfig.method !== 'GET' ? JSON.stringify(body) : undefined,
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        workflowResults.push({ api: step.api, data });

        // Update the users state if it's an update operation
        if (step.api === 'Update User') {
          setUsers(prevUsers => prevUsers.map(user => user.id === data.id ? data : user));
        }
      }
      setResults(workflowResults);
    } catch (error) {
      console.error('Error executing workflow:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
    <div className="container mx-auto max-w-6xl">
      
      <h1 className="text-3xl font-bold mb-6 text-blue-300">User Data Modification Dashboard</h1>
      
      <button 
        onClick={fetchInitialUserData} 
        disabled={isLoading}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-800 disabled:text-gray-400"
      >
        {isLoading ? 'Refreshing...' : 'Refresh User Data'}
      </button>

      <div className="mb-6 border border-gray-700 p-4 bg-gray-800 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-blue-300">Initial User Data</h2>
        <ul className="space-y-2">
          {users.map(user => (
            <li key={user.id} className="flex justify-between items-center bg-gray-700 p-3 rounded-md shadow-sm">
              <span>{user.name} (ID: {user.id}, Email: {user.email})</span>
              <button 
                onClick={() => setSelectedUser(user)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedUser && (
        <div className="mb-6 border border-gray-700 p-4 bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-blue-300">Edit User: {selectedUser.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(selectedUser).map(([key, value]) => (
              <div key={key} className="bg-gray-700 p-3 rounded-md shadow-sm">
                <label className="block text-sm font-medium text-gray-300 mb-1">{key}:</label>
                <input
                  value={value}
                  onChange={(e) => setSelectedUser({...selectedUser, [key]: e.target.value})}
                  className="w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white"
                />
              </div>
            ))}
          </div>
          <button 
            onClick={() => {
              setWorkflow([{
                api: 'Update User',
                params: { id: selectedUser.id },
                body: selectedUser,
                dataMapping: {}
              }]);
              setSelectedUser(null);
            }}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add to Workflow
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="border border-gray-700 p-4 bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-blue-300">Workflow Builder</h2>
          {workflow.map((step, index) => (
            <div key={index} className="mb-4 bg-gray-700 p-3 rounded-md shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <select
                  value={step.api}
                  onChange={(e) => handleApiChange(index, e.target.value)}
                  className="w-full mr-2 p-2 bg-gray-600 border border-gray-500 rounded-md text-white"
                >
                  <option value="">Select API</option>
                  {Object.keys(API_CONFIGS).map(api => (
                    <option key={api} value={api}>{api}</option>
                  ))}
                </select>
                <button 
                  onClick={() => removeApiFromWorkflow(index)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  X
                </button>
              </div>

              {step.api && (
                <div>
                  {API_CONFIGS[step.api].requestFields?.map(field => (
                    <div key={field} className="mb-2">
                      <label className="block text-sm font-medium text-gray-300 mb-1">{field}:</label>
                      <select
                        value={step.dataMapping[field]?.sourceApi || ''}
                        onChange={(e) => handleDataMappingChange(index, field, e.target.value, e.target.options[e.target.selectedIndex].getAttribute('data-field'))}
                        className="w-full mb-1 p-2 bg-gray-600 border border-gray-500 rounded-md text-white"
                      >
                        <option value="">Manual Input</option>
                        {results.map((result, resultIndex) => (
                          API_CONFIGS[result.api]?.responseFields.map(responseField => (
                            <option key={`${resultIndex}-${responseField}`} value={result.api} data-field={responseField}>
                              {result.api} - {responseField}
                            </option>
                          ))
                        ))}
                      </select>
                      {!step.dataMapping[field] && (
                        <input
                          placeholder={field}
                          value={step.body[field] || step.params[field] || ''}
                          onChange={(e) => API_CONFIGS[step.api].method === 'GET' ? handleParamChange(index, field, e.target.value) : handleBodyChange(index, field, e.target.value)}
                          className="w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button 
            onClick={addApiToWorkflow}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add API to Workflow
          </button>
        </div>

        <div className="border border-gray-700 p-4 bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-blue-300">Data Flow</h2>
          {workflow.map((step, index) => (
            <div key={index} className="mb-4 bg-gray-700 p-3 rounded-md shadow-sm">
              <h3 className="font-bold text-blue-300">{step.api}</h3>
              {Object.entries(step.dataMapping).map(([field, mapping]) => (
                <div key={field} className="flex items-center text-sm">
                  <span className="text-gray-300">{mapping.sourceApi} ({mapping.sourceField})</span>
                  <span className="mx-2 text-blue-400">→</span>
                  <span className="text-gray-300">{step.api} ({field})</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={executeWorkflow}
        disabled={isLoading}
        className="w-full mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-800 disabled:text-gray-400"
      >
        {isLoading ? 'Executing...' : 'Execute Workflow'}
      </button>

      {error && (
        <div className="mb-4 p-4 bg-red-900 border border-red-700 text-red-100 rounded">
          {error}
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold mb-2 text-blue-300">Results:</h2>
        {results.map((result, index) => (
          <div key={index} className="mb-2 border border-gray-700 p-3 bg-gray-700 rounded-md shadow-sm">
            <h3 className="font-bold text-blue-300">{result.api}</h3>
            <pre className="whitespace-pre-wrap text-sm overflow-x-auto text-gray-300">
              {JSON.stringify(result.data || result.error, null, 2)}
            </pre>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default UserDataModificationDashboard;