// import React, { useState, useEffect } from 'react';
import '../pages/History.css'

const sampleTypes = ["all", "influent", "effluent", "sludge", "prediction"];

function SamplesFilter({ selectedType, setSelectedType }: { selectedType: string, setSelectedType: (type: string) => void }) {
  return (
    <div className="filter-dropdown">
      <label htmlFor="sampleType">Show: </label>
      <select
        id="sampleType"
        value={selectedType}
        onChange={e => setSelectedType(e.target.value)}
        className="dropdown"
      >
        {sampleTypes.map(type => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SamplesFilter;
