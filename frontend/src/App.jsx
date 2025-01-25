import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RegisterForm } from './components/RegisterForm.jsx';
import { LoginForm } from './components/LoginForm.jsx';
import EmployeeList from './components/EmployeeList.jsx';
import { EmployeeForm } from './components/EmployeeForm.jsx';
import Header from './components/Header.jsx';
import { AddEmployeeForm } from './components/AddEmp.jsx';

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/users/employee');
        if (response.data.success) {
          setEmployees(response.data.data);
        } else {
          console.error('Failed to fetch employees:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    if (isAuthenticated) {
      fetchEmployees();
    }
  }, [isAuthenticated]);

  const handleRegister = (data) => {
    setIsAuthenticated(true);
    setUserRole(data.role);
    navigate('/employees');
  };

  const handleLogin = (data) => {
    setIsAuthenticated(true);
    setUserRole(data.role);
    navigate('/employees');
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    navigate(`/employees/edit/${employee.id}`);
  };

  const handleSaveEmployee = (employeeData) => {
    if (selectedEmployee) {
      setEmployees(employees.map((emp) => (emp.id === selectedEmployee.id ? { ...emp, ...employeeData } : emp)));
    } else {
      const newEmployee = {
        ...employeeData,
        id: Math.max(...employees.map((emp) => emp.id)) + 1,
        joinDate: new Date().toISOString().split('T')[0],
        imageUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      };
      setEmployees([...employees, newEmployee]);
    }
    setShowForm(false);
    setSelectedEmployee(null);
  };

  const handleLogout = () => {
  localStorage.removeItem('token');
  setIsAuthenticated(false);
  setUserRole('');
  navigate('/');
};


  return (
    <>
      <Header 
      isAuthenticated={isAuthenticated}
      onLogout={handleLogout}  
      />
      <div className="container">
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/employees" />
              ) : (
                <LoginForm onLogin={handleLogin} onSwitchToRegister={() => navigate('/register')} />
              )
            }
          />
           <Route
            path="/add"
            element={
              isAuthenticated ? (
                <AddEmployeeForm onSave={handleSaveEmployee} />
              ) : (
                <Navigate to="/employees" />
              )
            }
          />
          <Route
            path="/register"
            element={<RegisterForm onRegister={handleRegister} onSwitchToLogin={() => navigate('/')} />}
          />
          <Route
            path="/employees"
            element={
              isAuthenticated ? (
                <EmployeeList employees={employees} onEdit={handleEdit} userRole={userRole} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/employees/edit/:employeeId"
            element={
              isAuthenticated ? (
                <EmployeeForm
                  employee={selectedEmployee}
                  onSave={handleSaveEmployee}
                  onCancel={() => navigate('/employees')}
                />
              ) : (
                <Navigate to="/employees" />
              )
            }
          />
        </Routes>
      </div>
      {showForm && (
        <EmployeeForm
          employee={selectedEmployee}
          onSave={handleSaveEmployee}
          onCancel={() => setShowForm(false)}
        />
      )}
    </>
  );
};

export default App;
