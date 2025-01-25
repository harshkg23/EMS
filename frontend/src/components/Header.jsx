import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">
          <Link to="/">Employee Management System</Link>
        </div>
        <nav className="space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/add" className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Add Employees</Link>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">Login</Link>
              <Link to="/register" className="px-4 py-2 bg-yellow-500 rounded hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
