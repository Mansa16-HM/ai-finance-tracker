// src/components/Navbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <h1 className="text-2xl font-bold">FinanceTracker</h1>
        </div>

        {/* Nav Links */}
        <div className="flex gap-6 items-center">
          {user && (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className="hover:bg-blue-700 px-3 py-2 rounded transition"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/reports')}
                className="hover:bg-blue-700 px-3 py-2 rounded transition"
              >
                Reports
              </button>
              <div className="border-l border-blue-400 pl-6">
                <p className="text-sm">Welcome, {user.name}!</p>
                <button
                  onClick={handleLogout}
                  className="mt-1 bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
