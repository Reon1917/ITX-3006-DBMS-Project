'use client';

import { useMode } from '@/lib/context/ModeContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { mode } = useMode();
  const router = useRouter();

  useEffect(() => {
    if (mode !== 'admin') {
      router.push('/');
    }
  }, [mode, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          title="Service Management"
          description="Manage services, pricing, and employee requirements"
          link="/admin/services"
        />
        <DashboardCard 
          title="Employee Management"
          description="Manage employees and their specializations"
          link="/admin/employees"
        />
        <DashboardCard 
          title="Appointments"
          description="View and manage all appointments"
          link="/admin/appointments"
        />
      </div>
    </div>
  );
}

function DashboardCard({ title, description, link }) {
  const router = useRouter();

  return (
    <div 
      className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => router.push(link)}
    >
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
} 