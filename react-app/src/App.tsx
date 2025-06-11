import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Prediction from './pages/Prediction';
import History from './pages/History';
import './App.css';
import logo from './logo_bluelephant.png';

const App = () => {
  return (
    <Router>
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="BluElephant Logo"/>
        </div>
        <div className="navbar-links">
          <Link to="/home">Home</Link>
          <span className="separator">|</span>
          <Link to="/history">Measurements</Link>
          <span className="separator">|</span>
          <Link to="/prediction">Prediction</Link>
        </div>
        <div className="navbar-download">
          <a href='/Startup_Procedure_BE.pdf' download className='download-link'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              style={{ marginRight: '6px' }}
            >
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10.4a.5.5 0 0 1 1 0v2.6a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V10.4a.5.5 0 0 1 .5-.5z"/>
              <path d="M7.646 10.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 9.293V1.5a.5.5 0 0 0-1 0v7.793L5.354 7.146a.5.5 0 1 0-.708.708l3 3z"/>
            </svg>
              <span style={{ fontSize: '0.85rem', marginTop: '4px', color: 'inherit' }}>
                Download<br/>Startup<br/>Procedure
              </span>
          </a>
        </div>
      </nav>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>  
    </Router>
  );
};

export default App;
