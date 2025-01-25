import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeCard from './EmployeeCard';

const EmployeeList = ({ onEdit, userRole }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/users/employee');
        if (response.data.success) {
          setEmployees(response.data.data);
        } else {
          setError('Failed to fetch employees');
        }
      } catch (error) {
        setError('Error fetching employees');
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (employees.length === 0) {
    return <div>No employees found</div>;
  }

  return (
    <div className="space-y-4">
      {employees.map((employee) => (
        <EmployeeCard
          key={employee._id}
          employee={employee}
          onEdit={onEdit}
          userRole={userRole}
        />
      ))}
    </div>
  );
};

export default EmployeeList;
