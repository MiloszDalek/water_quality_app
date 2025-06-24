import React, { useState } from 'react';
import { getToken } from '../utils/auth';
import { parameterUnits } from '../utils/legalLimits';

interface AddSampleComponentProps {
  onClose: () => void;
  onSampleAdded: () => void;
}

const AddSampleComponent: React.FC<AddSampleComponentProps> = ({ onClose, onSampleAdded }) => {
  const [formData, setFormData] = useState({
    sample_type: 'influent',
    Ammonium: '',
    Phosphate: '',
    COD: '',
    BOD: '',
    Conductivity: '',
    PH: '',
    Nitrogen: '',
    Nitrate: '',
    Turbidity: '',
    TSS: '',
    date: new Date().toISOString().split('T')[0], // 'YYYY-MM-DD'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedPayload = Object.fromEntries(
    Object.entries(formData).map(([key, value]) => [
      key,
      value === '' ? null : value,
      ])
    );

    const payload = {
      ...cleanedPayload,
      prediction: -1,
      confidence: -1,
    };

    const token = getToken();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/save-result`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add sample');
      }

      onSampleAdded();
      onClose();

      const data = await response.json();
      alert(data.message);
      
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to add sample');
    }
  };

  return (
    <div className="relative w-full max-w-[600px] mx-auto my-2 p-6 bg-white rounded-xl shadow-lg">
      <button
        className="absolute top-2 right-2 w-8 h-8 text-4xl pb-2 font-bold text-[#999] border-2 border-[#999] rounded-none flex items-center justify-center cursor-pointer transition-colors duration-200 hover:text-red-600 hover:border-3 hover:border-red-600 bg-transparent"
        onClick={onClose}
      >
        &times;
      </button>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Add New Sample</h3>
      <form onSubmit={handleSubmit} className="space-y-1 md:space-y-3">
        {/* Sample type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sample Type:
          </label>
          <select
            name="sample_type"
            value={formData.sample_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="influent">Influent</option>
            <option value="effluent">Effluent</option>
            <option value="sludge">Sludge</option>
          </select>
        </div>

        {/* Dynamic numeric inputs */}
        {Object.keys(formData)
          .filter((k) => k !== 'sample_type' && k !== 'date')
          .map((param) => (
            <div key={param}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {param} {parameterUnits[param as keyof typeof parameterUnits] ? `(${parameterUnits[param as keyof typeof parameterUnits]})` : ''}:
              </label>
              <input
                type="number"
                name={param}
                value={formData[param as keyof typeof formData]}
                onChange={handleChange}
                step="any"
                className="w-full px-3 py-2 border rounded text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          ))}

        {/* Date input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date:
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Submit button */}
        <div className="pt-4 flex justify-center">
          <button
            type="submit"
            className="w-full md:max-w-[150px] bg-[#1e3a8a] cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow-sm transition-all"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSampleComponent;
