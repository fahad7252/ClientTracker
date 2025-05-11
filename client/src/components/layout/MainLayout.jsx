// src/components/layout/MainLayout.jsx
import { useState, useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Building, Users, ChevronDown, BarChart, Settings, LogOut, Menu, X, Calendar } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import SidebarCalendar from '../calendar/SidebarCalendar';

const MainLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-purple-900 bg-opacity-50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition duration-300 transform md:translate-x-0 bg-white md:static md:inset-0 md:relative md:flex-shrink-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:w-64 ${sidebarOpen ? 'md:w-64' : 'md:w-20'} rounded-r-xl shadow-xl`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-gradient-to-r from-purple-100 to-pink-100 rounded-tr-xl">
            <Link to="/dashboard" className="flex items-center">
              <div className="bg-purple-600 text-white p-1.5 rounded-lg shadow-md">
                <Users size={18} />
              </div>
              {sidebarOpen && <h1 className="ml-2 text-xl font-bold text-purple-800">ClientTrack</h1>}
            </Link>
            <button
              className="md:hidden text-purple-600 hover:text-purple-800 focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4 space-y-1">
              {/* Dashboard */}
              <Link
                to="/dashboard"
                className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:text-purple-800 rounded-lg transition-all duration-200"
              >
                <div className="p-1.5 rounded-md bg-blue-100 text-blue-600 shadow-sm">
                  <BarChart size={16} />
                </div>
                {sidebarOpen && <span className="ml-3 font-medium">Dashboard</span>}
              </Link>

              {/* Companies */}
              <Link
                to="/dashboard/companies"
                className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:text-purple-800 rounded-lg transition-all duration-200"
              >
                <div className="p-1.5 rounded-md bg-pink-100 text-pink-600 shadow-sm">
                  <Building size={16} />
                </div>
                {sidebarOpen && <span className="ml-3 font-medium">Companies</span>}
              </Link>

              {/* Appointments */}
              <Link
                to={`/dashboard/appointments/${new Date().toISOString().split('T')[0]}`}
                className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:text-purple-800 rounded-lg transition-all duration-200"
              >
                <div className="p-1.5 rounded-md bg-green-100 text-green-600 shadow-sm">
                  <Calendar size={16} />
                </div>
                {sidebarOpen && <span className="ml-3 font-medium">Appointments</span>}
              </Link>

              {/* Settings */}
              <Link
                to="/dashboard/settings"
                className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:text-purple-800 rounded-lg transition-all duration-200"
              >
                <div className="p-1.5 rounded-md bg-yellow-100 text-yellow-600 shadow-sm">
                  <Settings size={16} />
                </div>
                {sidebarOpen && <span className="ml-3 font-medium">Settings</span>}
              </Link>
            </nav>
            
            {/* Calendar in sidebar - only show when sidebar is open */}
            {sidebarOpen && (
              <div className="mx-2 p-2 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100">
                <SidebarCalendar />
              </div>
            )}
          </div>

          {/* Sidebar footer */}
          <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-br-xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white shadow-md">
                  {user?.name.charAt(0)}
                </div>
              </div>
              {sidebarOpen && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg w-full transition-colors duration-200 shadow-sm"
            >
              <div className="p-1 rounded-md bg-red-100">
                <LogOut size={14} />
              </div>
              {sidebarOpen && <span className="ml-2 font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="w-full bg-white shadow-md rounded-bl-xl">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 rounded-bl-xl">
            <button
              className="p-1.5 rounded-lg bg-white text-purple-600 shadow-md focus:outline-none md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <button
              className="p-1.5 rounded-lg bg-white text-purple-600 shadow-md focus:outline-none hidden md:block"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={20} />
            </button>
            <div className="relative">
              <div className="flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 shadow-sm">
                <span className="text-purple-800 font-medium">Welcome {user?.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;