'use client';

import { useState, useEffect } from 'react';
import { useMode } from '@/lib/context/ModeContext';
import { useRouter } from 'next/navigation';

export default function ServiceManagement() {
  const { mode } = useMode();
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    ServiceName: '',
    Description: '',
    Price: '',
    Duration: '',
    Category: '',
    RequiredEmployees: 1
  });

  useEffect(() => {
    if (mode !== 'admin') {
      router.push('/');
    }
    fetchServices();
  }, [mode, router]);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setShowForm(false);
        setFormData({
          ServiceName: '',
          Description: '',
          Price: '',
          Duration: '',
          Category: '',
          RequiredEmployees: 1
        });
        fetchServices();
      }
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  const handleDelete = async (serviceId) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Service Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add New Service
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add New Service</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Service Name"
                  value={formData.ServiceName}
                  onChange={(e) => setFormData({...formData, ServiceName: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.Description}
                  onChange={(e) => setFormData({...formData, Description: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.Price}
                  onChange={(e) => setFormData({...formData, Price: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={formData.Duration}
                  onChange={(e) => setFormData({...formData, Duration: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.Category}
                  onChange={(e) => setFormData({...formData, Category: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Required Employees"
                  value={formData.RequiredEmployees}
                  onChange={(e) => setFormData({...formData, RequiredEmployees: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                  min="1"
                />
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.Service_ID} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold">{service.ServiceName}</h2>
              <button
                onClick={() => handleDelete(service.Service_ID)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
            <p className="text-gray-600 mt-2">{service.Description}</p>
            <div className="mt-4 space-y-2">
              <p><span className="font-semibold">Price:</span> ${service.Price}</p>
              <p><span className="font-semibold">Duration:</span> {service.Duration} minutes</p>
              <p><span className="font-semibold">Category:</span> {service.Category}</p>
              <p><span className="font-semibold">Required Employees:</span> {service.RequiredEmployees}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 