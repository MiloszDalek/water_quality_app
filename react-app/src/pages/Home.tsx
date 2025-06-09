// HomePage.tsx
import React from 'react';
import './Home.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Water Quality Predictor</h1>
      <p>
        This application uses a <strong>Random Forest Classifier</strong> model, trained on an artificial dataset, to predict whether a water sample falls within the permitted range of parameters for surface water.
      </p>
      <h2>How to use the app?</h2>
      <ul>
        <li>
          Navigate to the <strong>Prediction</strong> tab to enter the water sample parameters and check its status.
        </li>
        <li>
          All predictions are saved and can be viewed anytime in the <strong>History</strong> tab.
        </li>
        <li>
          Additionally, you can compare how the levels of different parameters have changed over time in the same <strong>History</strong> tab.
        </li>
      </ul>
      <p>
        Feel free to explore the app and monitor water quality with ease!
      </p>
    </div>
  );
};

export default HomePage;
