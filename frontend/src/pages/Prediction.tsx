import React, { useState } from 'react';
import { parameterUnits } from '../utils/legalLimits';
import type { ParameterName } from '../utils/legalLimits';
import { getToken } from '../utils/auth';
import { isAuthenticated } from '../utils/auth';

const Prediction: React.FC = () => {
  const [formData, setFormData] = useState({
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

  });

  const [prediction, setPrediction] = useState<number | null>(null);

  const [confidence, setConfidence] = useState<number | null>(null);

  const sample_type = 'prediction';


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, parseFloat(value)])
    );

    const response = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    setPrediction(data.prediction);
    setConfidence(data.confidence);
  };


  const handleSave = async () => {
    if (prediction === null || confidence === null) return;

    const payload = {
        ...Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, parseFloat(value)])
        ),
        prediction,
        confidence,
        sample_type,
        date: new Date().toISOString().split('T')[0],
    };

    const token = getToken();

    const response = await fetch(`${import.meta.env.VITE_API_URL}/save-result`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    alert(data.message);
  };


  return (
    <div className='max-w-[600px] mx-auto my-2 p-4 md:p-8 bg-white rounded-xl shadow-md'>
      <div className='flex items-start bg-yellow-100 text-yellow-800 p-3 rounded mb-4 text-sm'>
        <span className="mr-1 md:mr-3 md:text-xl sm:text-lg leading-tight">⚠️</span>
        <span className="flex-1">
          This feature is a prototype based on insufficient data. The original goal was to analyze anomalies in samples to identify their cause, but the current model only predicts whether a sample is at risk of exceeding legal limits. This remains an area for future development.
        </span>
      </div>
      <h1 className="text-center text-gray-800 mb-6 text-2xl font-semibold">Enter water parameters</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="w-full max-w-[400px]">
            <label className="flex flex-col font-bold text-gray-700">
              <span>{key} {parameterUnits[key as ParameterName] ? ` (${parameterUnits[key as ParameterName]})` : ''}:</span>
              <input
                type="number"
                name={key}
                value={value}
                onChange={handleChange}
                step="any"
                required
                className="mt-1 p-2 border border-gray-300 rounded-md text-base w-full box-border"
              />
            </label>
          </div>
        ))}
        <button  
          type="submit"
          className="mt-4 max-w-[150px] w-full px-4 py-3 bg-blue-600 text-white rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Predict
        </button>
      </form>
      {prediction !== null && (
        <div
          className={`mt-6 p-4 rounded-lg text-center font-bold text-lg shadow-md
            ${prediction === 0 ? 'bg-green-100 text-green-800 border border-green-800' : 'bg-orange-100 text-orange-800 border border-orange-800'}`}
        >
          {prediction === 0
            ? "Sample far from exceeding"
            : "Sample close to exceeding"}
          {confidence !== null && (
            <p className="mt-2 italic text-base">
              Model confidence: {confidence.toFixed(1)}%
            </p>
          )}
          <div className="mt-4">
            {isAuthenticated() && (
            <button 
              onClick={handleSave}
              className={`mt-2 w-48 px-4 py-3 rounded-md text-lg font-medium
                ${prediction === 0 ? 'bg-green-800 text-green-100 hover:bg-green-900' : 'bg-orange-700 text-orange-100 hover:bg-orange-800'}
                transition-colors`}
            >
                Save Result
            </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Prediction;