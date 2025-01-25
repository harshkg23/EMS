import React from 'react';
import { format } from 'date-fns';
import { Mail, Calendar, Building2, Edit, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmployeeCard = ({ employee, userRole }) => {
  const formattedDate = employee.date ? format(new Date(employee.date), 'MMMM dd, yyyy') : '';
  const navigate = useNavigate();

  const handleEdit = () => {
    // Dynamically navigate to the edit page with the employee's ID
    navigate(`/employees/edit/${employee.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4">
        <img
          src={employee.avatar}
          alt={employee.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
          <p className="text-gray-600">{employee.position}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-gray-600"><Mail className="inline-block w-5 h-5 mr-2" />{employee.email}</p>
        <p className="text-gray-600"><Briefcase className="inline-block w-5 h-5 mr-2" />{employee.position}</p>
        <p className="text-gray-600"><Building2 className="inline-block w-5 h-5 mr-2" />{employee.department}</p>
        <p className="text-gray-600"><Calendar className="inline-block w-5 h-5 mr-2" />{formattedDate}</p>
        <p className="text-gray-600"><Calendar className="inline-block w-5 h-5 mr-2" />{employee.role}</p>
        <p className="text-gray-600"><Calendar className="inline-block w-5 h-5 mr-2" />{employee.status}</p>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            employee.status.toLowerCase() === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {employee.status}
        </span>
        {userRole !== 'user' && (
          <button
            onClick={handleEdit}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            <Edit className="inline-block w-5 h-5 mr-2" /> Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default EmployeeCard;
