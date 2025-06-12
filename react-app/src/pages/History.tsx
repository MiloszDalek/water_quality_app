import React, { useEffect, useState } from "react";
import ChartComponent from "../components/ChartComponent";
import SamplesFilter from "../components/SamplesFilter";
import ExportPanel from "../components/ExportPanel";
import './History.css'
import legalLimits, {ParameterName, parameterUnits} from "../utils/legalLimits";

interface Sample {
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

interface SampleCardProps {
  sample: Sample;
  onClick: () => void;
}

interface SampleDetailsProps {
  sample: Sample;
  onClose: () => void;
  onDelete: (id: number) => void;
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

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/samples?sample_type=${selectedType}`)
      .then(res => res.json())
      .then(data => setSamples(data))
      .catch(err => console.error('Fetch error:', err));
  }, [selectedType]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  const handleExport = (fileName: string, fileType: "csv" | "excel") => {
    console.log("Export requested:", fileName, fileType);
    alert("Exported");
    // Tu później dodasz kod do eksportu danych `samples`
  };

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
        const response = await fetch(`${process.env.REACT_APP_API_URL}/samples/${id}`, {
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
    const boxClass = sample.prediction === 0 ? 'box-sample success' : 'box-sample warning';

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


  const SampleDetails: React.FC<SampleDetailsProps> = ({ sample, onClose }) => {
    const boxClass = sample.prediction === 0 ? 'box-sample success' : 'box-sample warning';

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
        <ChartComponent data={samples} />
        <div className="toolbar">
          <SamplesFilter selectedType={selectedType} setSelectedType={setSelectedType} />
          <ExportPanel onExport={handleExport} />
        </div>  
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