'use client';

import { useMode } from '@/lib/context/ModeContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { mode, toggleMode } = useMode();
  const pathname = usePathname();
  const isAdmin = mode === 'admin';

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-blue-600">
              DBMS Project
            </Link>
            
            <div className="hidden md:flex space-x-4">
              {isAdmin ? (
                <>
                  <NavLink href="/admin" active={pathname === '/admin'}>
                    Dashboard
                  </NavLink>
                  <NavLink href="/admin/services" active={pathname.startsWith('/admin/services')}>
                    Services
                  </NavLink>
                  <NavLink href="/admin/employees" active={pathname.startsWith('/admin/employees')}>
                    Employees
                  </NavLink>
                  <NavLink href="/admin/appointments" active={pathname.startsWith('/admin/appointments')}>
                    Appointments
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink href="/services" active={pathname === '/services'}>
                    Services
                  </NavLink>
                  <NavLink href="/appointments" active={pathname === '/appointments'}>
                    My Appointments
                  </NavLink>
                </>
              )}
            </div>
          </div>

          <button
            onClick={toggleMode}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {mode === 'user' ? 'Switch to Admin' : 'Switch to User'}
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, active, children }) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        active
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {children}
    </Link>
  );
} 