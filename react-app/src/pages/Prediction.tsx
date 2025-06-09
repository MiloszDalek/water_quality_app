import React, { useState } from 'react';
import './Prediction.css';

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


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, parseFloat(value)])
    );

    const response = await fetch('http://localhost:8000/predict', {
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
    };

    const response = await fetch('http://localhost:8000/save-result', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    alert(data.message);
  };


  return (
    <div className='prediction-container'>
      <h1>Enter water parameters</h1>
      <form onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} style={{ marginBottom: 10 }}>
            <label>
              <span>{key}:</span>
              <input
                type="number"
                name={key}
                value={value}
                onChange={handleChange}
                step="any"
                required
              />
            </label>
          </div>
        ))}
        <button className='predict-button' type="submit">Predict</button>
      </form>
      {prediction !== null && (
        <div
          className={`result-box ${
            prediction === 0 ? "result-success" : "result-warning"
          }`}
        >  
          {prediction === 0
            ? "Sample far from exceeding"
            : "Sample close to exceeding"}
          {confidence !== null && (
            <p style={{ marginTop: 8, fontStyle: "italic" }}>
              Model confidence: {confidence.toFixed(1)}%
            </p>
          )}
          <div
            className={`save-button ${
              prediction === 0 ? "button-success" : "button-warning"
          }`}
          >
            <button onClick={handleSave} style={{ marginTop: '10px' }}>
                Save Result
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prediction;