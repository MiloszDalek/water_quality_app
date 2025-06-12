// HomePage.tsx
import React from 'react';
import './Home.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      <h1>BluElephant Water Analyzer</h1>
      <p>
        This application is designed to help you store, explore, and analyze water sample measurements with ease.
      </p>
      <h2>Main Features</h2>
      <ul>
        <li>
          Add and manage samples categorized as <strong>influent</strong>, <strong>effluent</strong>, or <strong>sludge</strong>.
        </li>
        <li>
          Explore trends and changes in specific water quality parameters over time.
        </li>
        <li>
          Export your data to <strong>Excel</strong> or <strong>CSV</strong> for further processing or reporting.
        </li>
        <li>
          Use the <strong>Prediction</strong> tab to test an experimental feature that evaluates whether a sample might exceed legal thresholds. Note: this is a prototype based on limited data.
        </li>
      </ul>
      <p>
        Whether you're monitoring treatment performance or tracking environmental impact, this tool makes water quality analysis more accessible.
      </p>
    </div>
  );
};

export default HomePage;
