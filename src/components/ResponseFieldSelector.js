// src/components/ResponseFieldSelector.js
import React, { useState } from 'react';

const ResponseFieldSelector = ({ response, setNextApiData }) => {
  const [selectedField, setSelectedField] = useState('');

  const handleSelectField = (e) => {
    const field = e.target.value;
    setSelectedField(field);
    setNextApiData((prevData) => ({ ...prevData, [field]: response[field] }));
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Select Response Field for Next API</h3>
      <select
        onChange={handleSelectField}
        className="border border-gray-400 p-2 rounded w-full"
      >
        <option value="">Select Field</option>
        {Object.keys(response).map((field, index) => (
          <option key={index} value={field}>
            {field}
          </option>
        ))}
      </select>

      {selectedField && (
        <div className="mt-4">
          <p className="text-gray-700">
            Selected Field: <strong>{selectedField}</strong> with value{' '}
            <strong>{JSON.stringify(response[selectedField])}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default ResponseFieldSelector;
