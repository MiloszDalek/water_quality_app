import React, { useState } from 'react';

interface AddSampleComponentProps {
  onClose: () => void;
  onSampleAdded: () => void;
}

const AddSampleComponent: React.FC<AddSampleComponentProps> = ({ onClose, onSampleAdded }) => {
  const [formData, setFormData] = useState({
    sample_type: 'influent',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      prediction: -1,
      confidence: -1,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/save-result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add sample');
      }

      onSampleAdded();
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to add sample');
    }
  };

  return (
    <div className="form-container">
      <button className="close-button" onClick={onClose}>&times;</button>
      <h3>Add New Sample</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Sample Type:
          <select name="sample_type" value={formData.sample_type} onChange={handleChange}>
            <option value="influent">Influent</option>
            <option value="effluent">Effluent</option>
            <option value="sludge">Sludge</option>
          </select>
        </label>

        {Object.keys(formData).filter(k => k !== 'sample_type').map((param) => (
          <label key={param}>
            {param}:
            <input
              type="number"
              name={param}
              value={formData[param as keyof typeof formData]}
              onChange={handleChange}
              step="any"
              required
            />
          </label>
        ))}

        <div style={{ marginTop: '1em' }}>
          <button type="submit" className='confirm-button'>Add</button>
        </div>
      </form>
    </div>
  );
};

export default AddSampleComponent;
