import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';

// Landing Page
import Home from './pages/Home';

// Layout Components
import MainLayout from './components/layout/MainLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';

// Company Pages
import CompanyList from './pages/company/CompanyList';
import CompanyDetails from './pages/company/CompanyDetails';
import CompanyForm from './pages/company/CompanyForm';

// Customer Pages
import CustomerList from './pages/customer/CustomerList';
import CustomerDetails from './pages/customer/CustomerDetails';
import CustomerForm from './pages/customer/CustomerForm';

// Appointment Pages
import AppointmentsByDate from './pages/appointment/AppointmentsByDate';
import AppointmentForm from './pages/appointment/AppointmentForm';

// Settings Pages
import Settings from './pages/settings/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes - Dashboard under /dashboard */}
          <Route path="/dashboard" element={<PrivateRoute element={<MainLayout />} />}>
            <Route index element={<Dashboard />} />
            
            {/* Company Routes */}
            <Route path="companies" element={<CompanyList />} />
            <Route path="companies/new" element={<CompanyForm />} />
            <Route path="companies/:id" element={<CompanyDetails />} />
            <Route path="companies/:id/edit" element={<CompanyForm isEdit />} />
            
            {/* Customer Routes */}
            <Route path="companies/:companyId/customers" element={<CustomerList />} />
            <Route path="companies/:companyId/customers/new" element={<CustomerForm />} />
            <Route path="customers/:id" element={<CustomerDetails />} />
            <Route path="customers/:id/edit" element={<CustomerForm isEdit />} />
            
            {/* Appointment Routes */}
            <Route path="appointments/:date" element={<AppointmentsByDate />} />
            <Route path="appointments/new" element={<AppointmentForm />} />
            <Route path="appointments/:id/edit" element={<AppointmentForm isEdit />} />
            
            {/* Settings Routes */}
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;