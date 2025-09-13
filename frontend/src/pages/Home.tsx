import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto my-4 bg-gray-50 px-6 py-8 lg:p-10 rounded-xl shadow-lg text-gray-900 font-sans">
      <h1 className="text-4xl font-bold mb-6 text-center" style={{ color: '#1e3a8a' }}>
        BluElephant Water Analyzer
      </h1>

      <p className="text-base sm:text-lg leading-relaxed mb-6">
        This application is designed to help you store, explore, and analyze water sample measurements with ease.
      </p>

      <h2 className="text-2xl font-semibold text-blue-600 mt-8 mb-4">Main Features</h2>

      <ul className="list-disc pl-5 text-base sm:text-lg leading-relaxed mb-6">
        <li>
          Add and manage samples categorized as <strong className="text-blue-600">influent</strong>, <strong className="text-blue-600">effluent</strong>, or <strong className="text-blue-600">sludge</strong>.
        </li>
        <li>
          Explore trends and changes in specific water quality parameters over time.
        </li>
        <li>
          Export your data to <strong className="text-blue-600">Excel</strong> or <strong className="text-blue-600">CSV</strong> for further processing or reporting.
        </li>
        <li>
          Use the <strong className="text-blue-600">Prediction</strong> tab to test an experimental feature that evaluates whether a sample might exceed legal thresholds. Note: this is a prototype based on limited data.
        </li>
      </ul>

      <p className="text-base sm:text-lg leading-relaxed">
        Whether you're monitoring treatment performance or tracking environmental impact, this tool makes water quality analysis more accessible.
      </p>
    </div>
  );
};

export default HomePage;
