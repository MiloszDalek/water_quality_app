import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Prediction from './pages/Prediction';
import History from './pages/History';
import Login from './pages/Login';
import './App.css';
import logo from './assets/logo_bluelephant.png';
import { isAuthenticated, removeToken } from './utils/auth';
import Register from './pages/Register';


const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  
  return (
    <Router>
      <nav className="flex items-center justify-between bg-[#003366] text-white px-0 sm:px-2 md:px-6  py-1 shadow-md relative">
        
        <div className="flex items-center space-x-2">
          <img src={logo} alt="BluElephant Logo" className="w-30 sm:w-32 md:w-40 min-w-[120px] h-auto" />
        </div>

        {/* Hamburger (mobile) */}
        <div className="lg:hidden flex-1 border-2 border-white rounded-md mx-2 px-2 py-2 flex items-center">
          <button
            className="lg:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Linki desktop + mobile (w mobile pokazują się po kliknięciu hamburgera) */}
        <div
          className={`
            lg:flex lg:flex-1 md:justify-center sm:space-x-0 md:space-x-1 md:text-2xl lg:text-4xl md:font-medium md:select-none
            ${menuOpen ? 'block absolute top-full left-0 w-full bg-[#003366] py-4 px-6' : 'hidden'}
            md:static md:w-auto md:bg-transparent
          `}
        >
          <Link
            to="/home"
            className="block py-2 hover:text-[#66ccff] transition-colors duration-300 ease-in-out"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <span className="hidden md:inline text-white text-4xl lg:text-5xl select-none pointer-events-none">|</span>
          <Link
            to="/measurements"
            className="block py-2 hover:text-[#66ccff] transition-colors duration-300 ease-in-out"
            onClick={() => setMenuOpen(false)}
          >
            Measurements
          </Link>
          <span className="hidden md:inline text-white text-4xl lg:text-5xl select-none pointer-events-none">|</span>
          <Link
            to="/prediction"
            className="block py-2 hover:text-[#66ccff] transition-colors duration-300 ease-in-out"
            onClick={() => setMenuOpen(false)}
          >
            Prediction
          </Link>
        

          {/* Login/Register OR Logout */}
          <div className="md:flex md:flex-col md:mt-1 md:ml-4 md:pl-4">
          {!loggedIn ? (
            <>
              <Link
                to="/login"
                className="block py-2 md:px-0 md:py-0 lg:text-base hover:text-[#66ccff] transition-colors duration-300 ease-in-out"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block py-2 md:px-0 md:py-0 lg:text-base hover:text-[#66ccff] transition-colors duration-300 ease-in-out"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                removeToken();
                window.location.href = '/';
              }}
              className="block w-full md:w-auto px-3 py-1.5 mt-2 md:mt-2 text-center text-sm text-white bg-[#003366] border border-white rounded hover:bg-red-600 hover:text-white focus:outline-none focus:ring-1 focus:ring-red-400 transition-all duration-300"
            >
              Logout
            </button>
          )}
          </div>
        </div>

        <div className="ml-auto px-4 md:flex">
          <a
            href="/Start up document BE.pdf"
            download
            className="flex items-center text-white font-bold hover:underline hover:text-[#66ccff] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              className="mr-1"
            >
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10.4a.5.5 0 0 1 1 0v2.6a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V10.4a.5.5 0 0 1 .5-.5z" />
              <path d="M7.646 10.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 9.293V1.5a.5.5 0 0 0-1 0v7.793L5.354 7.146a.5.5 0 1 0-.708.708l3 3z" />
            </svg>
            <span className="text-xs leading-tight">
              Download
              <br />
              Startup
              <br />
              Procedure
            </span>
          </a>
        </div>
      </nav>

      <div className="p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/measurements" element={<History />} />
          <Route path="/login" element={<Login onLogin={() => setLoggedIn(true)} />} />
          <Route path="/register" element={<Register/>} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
