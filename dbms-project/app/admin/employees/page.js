'use client';

import { useState, useEffect } from 'react';
import { useMode } from '@/lib/context/ModeContext';
import { useRouter } from 'next/navigation';

export default function EmployeeManagement() {
  const { mode } = useMode();
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    PhoneNumber: '',
    Email: '',
    Specialization: '',
    WorkStatus: 'Active'
  });

  useEffect(() => {
    if (mode !== 'admin') {
      router.push('/');
      return;
    }
    fetchEmployees();
  }, [mode, router]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed to create employee');
      
      setShowForm(false);
      setFormData({
        FirstName: '',
        LastName: '',
        PhoneNumber: '',
        Email: '',
        Specialization: '',
        WorkStatus: 'Active'
      });
      fetchEmployees();
    } catch (error) {
      console.error('Error creating employee:', error);
      alert('Failed to create employee. Please try again.');
    }
  };

  const handleStatusChange = async (employeeId, newStatus) => {
    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ WorkStatus: newStatus }),
      });
      
      if (!response.ok) throw new Error('Failed to update employee status');
      fetchEmployees();
    } catch (error) {
      console.error('Error updating employee status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Employee Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add New Employee
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add New Employee</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.FirstName}
                  onChange={(e) => setFormData({...formData, FirstName: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.LastName}
                  onChange={(e) => setFormData({...formData, LastName: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.PhoneNumber}
                  onChange={(e) => setFormData({...formData, PhoneNumber: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.Email}
                  onChange={(e) => setFormData({...formData, Email: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Specialization"
                  value={formData.Specialization}
                  onChange={(e) => setFormData({...formData, Specialization: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
                <select
                  value={formData.WorkStatus}
                  onChange={(e) => setFormData({...formData, WorkStatus: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(employees) && employees.map((employee) => (
          <div key={employee.EMPLOYEE_ID} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold">
                {employee.FIRSTNAME} {employee.LASTNAME}
              </h2>
              <select
                value={employee.WORKSTATUS}
                onChange={(e) => handleStatusChange(employee.EMPLOYEE_ID, e.target.value)}
                className="p-1 border rounded text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
            <div className="mt-4 space-y-2">
              <p><span className="font-semibold">Email:</span> {employee.EMAIL}</p>
              <p><span className="font-semibold">Phone:</span> {employee.PHONENUMBER}</p>
              <p><span className="font-semibold">Specialization:</span> {employee.SPECIALIZATION}</p>
              <p className={`font-semibold ${
                employee.WORKSTATUS === 'Active' ? 'text-green-600' :
                employee.WORKSTATUS === 'On Leave' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                Status: {employee.WORKSTATUS}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 