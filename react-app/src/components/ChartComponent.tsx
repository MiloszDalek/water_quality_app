import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import legalLimits, { ParameterName, parameterUnits } from '../utils/legalLimits';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Result {
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
  data: Result[];
}

const options = {
  responsive: true,
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

  const extraDatasets = [];

  if (limit?.max !== undefined) {
    extraDatasets.push({
      label: 'Legal max',
      data: new Array(data.length).fill(limit.max),
      borderColor: 'green',
      borderDash: [10, 5],
      borderWidth: 2,
      pointRadius: 0,
      fill: false,
      tension: 0,
    });
  }

  if (limit?.min !== undefined) {
    extraDatasets.push({
      label: 'Legal min',
      data: new Array(data.length).fill(limit.min),
      borderColor: 'red',
      borderDash: [10, 5],
      borderWidth: 2,
      pointRadius: 0,
      fill: false,
      tension: 0,
    });
  }

  const sortedData = [...data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const chartData = {
    labels: sortedData.map(d => new Date(d.timestamp).toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit', 
      hour: '2-digit',
      minute: '2-digit',
      second: undefined,
    })),
    datasets: [
      {
        label: selectedParam,
        data: sortedData.map(d => d[selectedParam]),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.3,
      },
    ...extraDatasets,
    ],
  };

  const labelWithUnits = (param: ParameterName) =>
  `${param}${parameterUnits[param] ? ` (${parameterUnits[param]})` : ''}`;


  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <div style={{ maxWidth: 800, margin: 'auto' }}>
        <h3>{labelWithUnits(selectedParam)} over Time</h3>
        <select
          value={selectedParam}
          onChange={e => setSelectedParam(e.target.value as ParameterName)}
          style={{ marginBottom: 20, padding: 5 }}
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

        <Line data={chartData} options={options}/>
      </div>
    </div>
  );
};

export default ChartComponent;
