import React, { useEffect, useState } from "react";
import ChartComponent from "../components/ChartComponent";
import './History.css'
import legalLimits, {ParameterName, parameterUnits} from "../utils/legalLimits";

interface Result {
  id: number;
  timestamp: string;
  prediction: number;
  confidence: number;
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

interface ResultCardProps {
  sample: Result;
  onClick: () => void;
}

interface ResultDetailsProps {
  sample: Result;
  onClose: () => void;
  onDelete: (id: number) => void;
}

const THRESHOLD = 0.8; // 80%

const getValueClass = (param: ParameterName, value: number): string => {
  const limit = legalLimits[param];
  // if (param === 'PH') {
  //   if (limit.min !== undefined && limit.max !== undefined) {
  //     limit.min = limit.min - 2;
  //     limit.max = limit.max + 2;
  //   }
  // }
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
  const [results, setResults] = useState<Result[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/results`)
      .then(res => res.json())
      .then(data => setResults(data))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const onDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this sample?")) return;

    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/results/${id}`, {
        method: 'DELETE',
        });

        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Delete failed');
        }

        setResults(prev => prev.filter(result => result.id !== id));
        setExpandedId(null);
    } catch (err) {
        console.error('Delete error:', err);
        alert("Error deleting record");
    }
  };


  const ResultCard: React.FC<ResultCardProps> = ({ sample, onClick }) => {
    const boxClass = sample.prediction === 0 ? 'box-result success' : 'box-result warning';

    return (
        <div onClick={onClick} className="card">
            <p className="card-date">{formatDate(sample.timestamp)}</p>
            <div className={boxClass}>   
                <p className="prediction">{sample.prediction === 0 ? 'Far from exceeding' : 'Risk of exceeding'}</p>
                <p className="box-separator">|</p>
                <p className="confidence">Confidence: {sample.confidence}%</p>
            </div>
        </div>
    );
  };


  const ResultDetails: React.FC<ResultDetailsProps> = ({ sample, onClose }) => {
    const boxClass = sample.prediction === 0 ? 'box-result success' : 'box-result warning';

    const parameters: ParameterName[] = [
        'Ammonium', 'Phosphate', 'COD', 'BOD', 'Conductivity',
        'PH', 'Nitrogen', 'Nitrate', 'Turbidity', 'TSS'
    ];

    return (
        <div className="details-card">
            <button className="close-button" onClick={onClose}>&times;</button>    
            <div style={{textAlign:'center', margin: '0 auto', maxWidth: '500px'}}>
                <h3>Prediction date: {formatDate(sample.timestamp)}</h3>
                <div className={boxClass}>   
                    <p className="prediction">{sample.prediction === 0 ? 'Far from exceeding' : 'Risk of exceeding'}</p>
                    <p className="box-separator">|</p>
                    <p className="confidence">Confidence: {sample.confidence}%</p>
                </div>
            </div>
            <ul>
                {parameters.map(param => (
                    <li key={param}>
                        <span className="param-label">{param === 'PH' ? 'pH' : param === 'Nitrogen' ? 'Total Nitrogen' : param}:</span>
                        <span className={`param-value ${getValueClass(param, sample[param])}`}>
                           {sample[param]} {parameterUnits[param]}
                        </span>
                    </li>
                ))}
                <button className="delete-button" onClick={() => onDelete(sample.id)}>Delete</button>
            </ul>
        </div>
    );
  };


  return (
    <div className="history-container">
        <ChartComponent data={results} />
        {results.map((sample) =>
        expandedId === sample.id ? (
            <ResultDetails
            key={sample.id}
            sample={sample}
            onClose={() => setExpandedId(null)}
            onDelete={onDelete}
            />
        ) : (
            <ResultCard
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