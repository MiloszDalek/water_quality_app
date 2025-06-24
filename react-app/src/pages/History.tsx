import React, { useEffect, useState } from "react";
import ChartComponent from "../components/ChartComponent";
import SamplesFilter from "../components/SamplesFilter";
import ExportPanel from "../components/ExportPanel";
import AddSampleComponent from "../components/AddSampleComponent";
import './History.css'
import legalLimits, { parameterUnits } from "../utils/legalLimits";
import type { ParameterName } from "../utils/legalLimits";
import { exportToExcel, exportToCSV } from "../utils/exportUtils";
import { isAuthenticated, getLoggedUserId } from "../utils/auth";

interface Sample {
  id: number;
  timestamp: string;
  prediction: number;
  confidence: number;
  sample_type: string;
  Ammonium: number;
  Phosphate: number;
  COD: number;
  BOD: number;
  Conductivity: number;
  PH: number;
  Nitrogen: number;
  Nitrate: number;
  Turbidity: number;
  TSS: number;
  [key: string]: any;
}

interface SampleCardProps {
  sample: Sample;
  onClick: () => void;
}

interface SampleDetailsProps {
  sample: Sample;
  onClose: () => void;
  onDelete: (id: number) => void;
}

interface User {
  id: number;
  username: string;
}

const THRESHOLD = 0.8; // 80%

const getValueClass = (param: ParameterName, value: number): string => {
  const limit = legalLimits[param];
  if (!limit) return '';

  if (limit.max !== undefined) {
    if (value > limit.max) return 'exceed-limit';
    if (value >= limit.max * THRESHOLD) return 'near-limit';
  }
  if (limit.min !== undefined) {
    if (value < limit.min) return 'exceed-limit';
    if (value <= limit.min * (2 - THRESHOLD)) return 'near-limit';
  }
  return '';
};


const History: React.FC = () => {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | "">("");
  const [users, setUsers] = useState<User[]>([]);

  const fetchSamples = () => {
    const loggedUserId = isAuthenticated() ? getLoggedUserId() : null;

    let url = `${import.meta.env.VITE_API_URL}/samples?sample_type=${selectedType}`;
    if (isAuthenticated()) {
      if (loggedUserId) {
        url += `&user_id=${loggedUserId}`;
      }
    } else {
      if (selectedUser) {
        url += `&user_id=${selectedUser}`;
      }
    }

    fetch(url)
      .then(res => res.json())
      .then(data => setSamples(data))
      .catch(err => console.error('Fetch error:', err));
};

  useEffect(() => {
    fetchSamples();
  }, [selectedType, selectedUser]);

  useEffect(() => {
    
  fetch(`${import.meta.env.VITE_API_URL}/users`)
    .then(res => res.json())
    .then(data => setUsers(data))
    .catch(err => console.error('Fetch users error:', err));
  }, []);

  const handleExport = (fileName: string, fileType: "csv" | "excel") => {
    if (!samples || samples.length === 0) {
        alert("No data to export.");
        return;
      }
    
    const isPrediction = selectedType === 'prediction' || selectedType === 'all';

    const filteredSamples = samples.map(({ id, timestamp, prediction, confidence, ...rest }) => {
      const base: any = {
        ID: id,
        Timestamp: new Date(timestamp).toLocaleString(),
      };

      Object.entries(rest).forEach(([key, value]) => {
        const displayName =
          key === "PH" ? "pH" :          
          key === "Nitrogen" ? "Nitrogen Total" :
          key === "sample_type" ? "Sample Type" :
          key;

        const unit = parameterUnits[key as ParameterName] || "";
        base[unit ? `${displayName} (${unit})` : displayName] = value;
      });

    if (isPrediction && prediction !== -1 && confidence !== -1) {
      base.Prediction = prediction === 1 ? "warning" : "normal";
      base.Confidence = `${confidence}%`;
    }

      return base;
    });

    if (fileType === "csv") {
      exportToCSV(filteredSamples, fileName);
    } else {
      exportToExcel(filteredSamples, fileName);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const onDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this sample?")) return;

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/samples/${id}`, {
        method: 'DELETE',
        });

        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Delete failed');
        }

        setSamples(prev => prev.filter(sample => sample.id !== id));
        setExpandedId(null);
    } catch (err) {
        console.error('Delete error:', err);
        alert("Error deleting record");
    }
  };


  const SampleCard: React.FC<SampleCardProps> = ({ sample, onClick }) => {
    const isPrediction = sample.sample_type === 'prediction';
    const boxClass = isPrediction
      ? sample.prediction === 0
        ? 'bg-green-100 text-green-800 border border-green-800 mt-1'
        : 'bg-orange-100 text-orange-800 border border-orange-800 mt-1'
      : {
          neutral: 'bg-gray-200 text-gray-700 border-gray-400',
          influent: 'bg-blue-200 text-blue-900 border-blue-900',
          sludge: 'bg-gray-300 text-gray-700 border-gray-700',
          effluent: 'bg-cyan-200 text-cyan-800 border-cyan-800',
        }[sample.sample_type] || 'bg-gray-200 text-gray-700 border-gray-400';

    return (
        <div
          onClick={onClick}
          className="flex flex-wrap justify-between max-w-md mx-auto w-full items-center border border-gray-300 rounded-lg bg-gray-50 p-4 cursor-pointer
                 transition-transform duration-200 hover:-translate-y-1.5 hover:shadow-lg"
        >
            <p className="text-lg md:text-2xl lg:text-3xl font-bold mx-auto whitespace-nowrap flex-shrink-0">
              {formatDate(sample.timestamp)}
            </p>
            <div 
              className={`flex items-center justify-center px-2 sm:px-4 py-4 rounded-full font-bold min-w-[120px] w-auto border-3 mx-auto
                    ${boxClass}`}
            > 
              {isPrediction ? (
                <>
                  <p className="text-base whitespace-nowrap text-sm sm:text-base">
                    {sample.prediction === 0 ? 'Far from exceeding' : 'Risk of exceeding'}
                  </p>
                  <p className="mx-1 sm:mx-2 text-base select-none text-sm sm:text-base">
                    |
                  </p>
                  <p className="text-base whitespace-nowrap text-sm sm:text-base">
                    Confidence: {sample.confidence}%
                  </p>
                </>
              ) : (
                <p className="text-base whitespace-nowrap">
                  {sample.sample_type.charAt(0).toUpperCase() + sample.sample_type.slice(1)}
                </p>
              )}
            </div>
        </div>
    );
  };


  const SampleDetails: React.FC<SampleDetailsProps> = ({ sample, onClose }) => {
    const isPrediction = sample.sample_type === 'prediction';
    const boxClass = isPrediction
      ? sample.prediction === 0
        ? 'bg-green-100 text-green-800 border border-green-800'
        : 'bg-orange-100 text-orange-800 border border-orange-800'
      : {
          neutral: 'bg-gray-200 text-gray-700 border-gray-400',
          influent: 'bg-blue-200 text-blue-900 border-blue-900',
          sludge: 'bg-gray-300 text-gray-700 border-gray-700',
          effluent: 'bg-cyan-200 text-cyan-800 border-cyan-800',
        }[sample.sample_type] || 'bg-gray-200 text-gray-700 border-gray-400';


    const parameters: ParameterName[] = [
        'Ammonium', 'Phosphate', 'COD', 'BOD', 'Conductivity',
        'PH', 'Nitrogen', 'Nitrate', 'Turbidity', 'TSS'
    ];

    return (
        <div className="relative bg-white rounded-lg shadow-md p-6 w-full max-w-[500px] mx-auto">
            <button 
              className="absolute top-2 right-2 w-8 h-8 text-4xl pb-2 font-bold text-[#999] border-2 border-[#999] rounded-none
                    flex items-center justify-center cursor-pointer transition-colors duration-200 hover:text-red-600 hover:border-3 hover:border-red-600 bg-transparent"
              onClick={onClose}
            >
              &times;
            </button>

            <div className="text-center mx-auto max-w-[500px] mb-6">
                <h3 className="text-xl font-semibold my-3 flex flex-col sm:flex-row sm:items-center text-center sm:text-left justify-center">
                  <span>Measurement date:</span> 
                  <span className="sm:ml-2">{formatDate(sample.timestamp)}</span>
                </h3>
                <div className={`inline-flex flex-wrap items-center justify-center px-1 sm:px-4 py-4 rounded-full font-bold w-auto border-3 mx-auto min-w-[180px]
                    ${boxClass}`}>
                  {isPrediction ? (  
                    <>
                      <p className="text-base whitespace-nowrap text-sm sm:text-base">
                        {sample.prediction === 0 ? 'Far from exceeding' : 'Risk of exceeding'}
                      </p>
                      <p className="mx-1 sm:mx-2 whitespace-nowrap text-base select-none text-sm sm:text-base">
                        |
                      </p>
                      <p className="text-base whitespace-nowrap text-sm sm:text-base">
                        Confidence: {sample.confidence}%
                      </p>
                    </>
                  ) : (
                    <p className="whitespace-nowrap text-base sm:text-lg">
                      {sample.sample_type.charAt(0).toUpperCase() + sample.sample_type.slice(1)}
                    </p>
                  )}
                </div>
            </div>
            <ul className="space-y-3 text-gray-800 max-w-[270px] mx-auto divide-y divide-gray-200">
                {parameters.map(param => (
                    <li key={param} className="flex justify-between items-center px-2">
                        <span className="font-semibold">
                          {param === 'PH' ? 'pH' : param === 'Nitrogen' ? 'Total Nitrogen' : param}:
                        </span>
                        <span 
                          className={`px-2 py-1 rounded text-sm font-medium ${
                            isPrediction
                              ? getValueClass(param, sample[param]) === 'near-limit'
                                  ? 'bg-yellow-300 text-yellow-900'
                                  : getValueClass(param, sample[param]) === 'exceed-limit'
                                  ? 'bg-red-600 text-white'
                                  : 'bg-transparent text-gray-700'
                                : 'bg-transparent text-gray-700'
                          }`}
                        >
                          {sample[param] !== null && typeof sample[param] === 'number'
                            ? `${sample[param]} ${parameterUnits[param]}`
                            : '---'}
                        </span>
                    </li>
                ))}
                {isAuthenticated() && (
                  <button 
                    className="mt-6 w-1/2 mx-auto block bg-red-600 cursor-pointer hover:bg-red-700 text-white font-semibold py-2 rounded transition-colors duration-200"
                    onClick={() => onDelete(sample.id)}
                  >
                    Delete
                  </button>
                )}
            </ul>
        </div>
    );
  };


  return (
    <div className="text-black flex flex-col gap-2 md:gap-4 p-4 font-sans max-w-[700px] w-full mx-auto">
        <div className="w-full bg-gray-50 border border-gray-300 rounded-lg shadow-sm p-4 mb-1 whitespace-nowrap">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-center">
            <SamplesFilter selectedType={selectedType} setSelectedType={setSelectedType} />
            {!isAuthenticated() && (
              <div className="flex items-center gap-2">
                <label htmlFor="user-select" className="mb-0">Select user: </label>
                <select
                  id="user-select"
                  value={selectedUser || ''}
                  onChange={e => setSelectedUser(e.target.value ? Number(e.target.value) : "")}
                  className="px-3 py-2 border rounded w-full sm:w-40 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">All</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.username}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
        <ChartComponent data={samples} />
        <div className="flex flex-wrap gap-4 mb-4 justify-center">
          <ExportPanel onExport={handleExport} />
          {isAuthenticated() && (
            <button 
              onClick={() => setShowForm(true)} 
              className="px-4 py-2 bg-[#1e3a8a] w-full sm:max-w-[410px] cursor-pointer text-white rounded hover:bg-blue-700 transition-all text-sm"
            >
              Add Sample
            </button>
          )}
        </div>
        {showForm && (
        <AddSampleComponent
          onClose={() => setShowForm(false)}
          onSampleAdded={() => {
            setShowForm(false);
            fetchSamples();
          }}
        />
        )}
        {samples.map((sample) =>
        expandedId === sample.id ? (
            <SampleDetails
            key={sample.id}
            sample={sample}
            onClose={() => setExpandedId(null)}
            onDelete={onDelete}
            />
        ) : (
            <SampleCard
            key={sample.id}
            sample={sample}
            onClick={() => setExpandedId(sample.id)}
            />
        )
        )}
    </div>
  );

};

export default History;