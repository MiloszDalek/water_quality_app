import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import legalLimits, { parameterUnits } from '../utils/legalLimits';
import type { ParameterName } from '../utils/legalLimits';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Filler, Tooltip, Legend);

interface Sample {
  timestamp: string;
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

interface Props {
  data: Sample[];
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: 'black',
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: '#ddd',
      },
      ticks: {
        color: 'black'
      }
    },
    y: {
      grid: {
        color: '#ddd',
      },
      ticks: {
        color: 'black'
      }
    }
  },
  layout: {
    padding: 20
  },
  backgroundColor: 'white',
};


const ChartComponent: React.FC<Props> = ({ data }) => {
  const [selectedParam, setSelectedParam] = useState<ParameterName>('Ammonium');

  const limit = legalLimits[selectedParam];
  const [showLimits, setShowLimits] = useState(true);

const filteredSortedData = [...data]
  .filter(d => typeof d[selectedParam] === 'number')
  .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const chartData = {
    labels: filteredSortedData.map(d =>
      new Date(d.timestamp).toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    ),
    datasets: [
      {
        label: selectedParam,
        data: filteredSortedData.map(d => d[selectedParam]),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.3,
      },
      ...(showLimits && limit?.max !== undefined
        ? [{
            label: 'Legal max',
            data: new Array(filteredSortedData.length).fill(limit.max),
            borderColor: 'green',
            borderDash: [10, 5],
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
            tension: 0,
          }]
        : []),
      ...(showLimits && limit?.min !== undefined
        ? [{
            label: 'Legal min',
            data: new Array(filteredSortedData.length).fill(limit.min),
            borderColor: 'red',
            borderDash: [10, 5],
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
            tension: 0,
          }]
        : []),
    ],
  };

  const labelWithUnits = (param: ParameterName) =>
  `${param}${parameterUnits[param] ? ` (${parameterUnits[param]})` : ''}`;


  return (
    <div className="bg-white w-full rounded-lg shadow-md max-w-3xl mx-auto">
      <div className="p-5 pb-0">
        <h3 className="text-lg font-semibold mb-4 text-center sm:text-left">
          {labelWithUnits(selectedParam)} over Time
        </h3>
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
          <select
            value={selectedParam}
            onChange={e => setSelectedParam(e.target.value as ParameterName)}
            className="w-full max-w-xs px-3 py-2 mb-0 md:mb-2 cursor-pointer border border-gray-300 rounded shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="Ammonium">Ammonium</option>
            <option value="Phosphate">Phosphate</option>
            <option value="COD">COD</option>
            <option value="BOD">BOD</option>
            <option value="Conductivity">Conductivity</option>
            <option value="PH">pH</option>
            <option value="Nitrogen">Total Nitrogen</option>
            <option value="Nitrate">Nitrate</option>
            <option value="Turbidity">Turbidity</option>
            <option value="TSS">TSS</option>
          </select>
          <div className="mt-4 flex ml-3 items-center pb-6 space-x-2">
            <input
              id="showLimits"
              type="checkbox"
              checked={showLimits}
              onChange={() => setShowLimits(prev => !prev)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-[#1e3a8a] border-gray-300 rounded"
            />
            <label htmlFor="showLimits" className="text-sm text-gray-700">
              Show legal limits for surface water
            </label>
          </div>
        </div>
      </div>
      <div className="w-full relative min-h-[250px] sm:min-h-[300px] md:min-h-[350px]" style={{ paddingTop: '50%' }}>
        <div className="absolute top-0 left-0 w-full h-full">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
