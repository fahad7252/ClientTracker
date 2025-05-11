// src/pages/appointment/AppointmentForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Save } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify';

const AppointmentForm = ({ isEdit }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    title: '',
    date: new Date(),
    customer: '',
    company: '',
    notes: ''
  });
  
  const [companies, setCompanies] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  
  const { title, date, customer, company, notes } = formData;

  useEffect(() => {
    fetchCompanies();
    
    if (isEdit && id) {
      fetchAppointment();
    }
  }, [isEdit, id]);

  useEffect(() => {
    if (selectedCompany) {
      fetchCustomers(selectedCompany);
    }
  }, [selectedCompany]);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get('/api/companies', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCompanies(res.data.data || []);
    } catch (err) {
      console.error('Error fetching companies:', err);
      toast.error('Failed to load companies');
    }
  };

  const fetchCustomers = async (companyId) => {
    try {
      const res = await axios.get(`/api/companies/${companyId}/customers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCustomers(res.data.data || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
      toast.error('Failed to load customers');
    }
  };

  const fetchAppointment = async () => {
    try {
      setFetchLoading(true);
      const res = await axios.get(`/api/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const appointmentData = res.data.data;
      
      let appointmentDate;
      if (appointmentData.date) {
        appointmentDate = new Date(appointmentData.date);
      } else {
        appointmentDate = new Date();
      }
      
      setFormData({
        title: appointmentData.title || '',
        date: appointmentDate,
        customer: appointmentData.customer?._id || appointmentData.customer || '',
        company: appointmentData.company?._id || appointmentData.company || '',
        notes: appointmentData.notes || ''
      });
      
      if (appointmentData.company?._id || appointmentData.company) {
        setSelectedCompany(appointmentData.company?._id || appointmentData.company);
      }
    } catch (err) {
      console.error('Error fetching appointment:', err);
      toast.error('Failed to load appointment details');
      // Navigate to appointments list instead of root
      const today = new Date().toISOString().split('T')[0];
      navigate(`/dashboard/appointments/${today}`);
    } finally {
      setFetchLoading(false);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'company') {
      setSelectedCompany(value);
      setFormData({ 
        ...formData, 
        [name]: value,
        customer: '' 
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !date || !customer || !company) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      setLoading(true);
      
      // Extract the date and time components
      const year = date.getFullYear();
      const month = date.getMonth(); // 0-based
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      
      // Format for URL (YYYY-MM-DD)
      const dateForUrl = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Create a custom ISO string with explicit Z suffix - this freezes the timezone as UTC
      const isoDate = `${dateForUrl}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00.000Z`;
      
      const appointmentData = {
        ...formData,
        // Use our manually constructed date string
        date: isoDate
      };
      
      if (isEdit) {
        await axios.put(`/api/appointments/${id}`, appointmentData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Appointment updated successfully');
      } else {
        await axios.post('/api/appointments', appointmentData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Appointment created successfully');
      }
      
      // Navigate to the correct date page with proper dashboard prefix
      navigate(`/dashboard/appointments/${dateForUrl}`);
    } catch (err) {
      console.error('Error saving appointment:', err);
      toast.error('Failed to save appointment');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  // Helper to format the date for display in the date picker
  const formatDate = (date) => {
    if (!date) return '';
    
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();
    
    // Format time in 12-hour format
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    return `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
  };

  // Get back link based on context
  const getBackLink = () => {
    if (isEdit && id) {
      // If editing, go back to the appointment view
      return `/dashboard/appointments/${id}`;
    } else {
      // If creating new, go back to appointments list for today
      const today = new Date().toISOString().split('T')[0];
      return `/dashboard/appointments/${today}`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center mb-6">
        <Link 
          to={getBackLink()} 
          className="p-1.5 rounded-lg bg-gray-100 text-purple-600 hover:bg-purple-100 mr-4 transition-colors duration-200"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-bold text-purple-800">
          {isEdit ? 'Edit Appointment' : 'New Appointment'}
        </h1>
      </div>

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              value={title}
              onChange={onChange}
              required
            />
          </div>

          {/* Date and Time */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date and Time <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DatePicker
                selected={date}
                onChange={handleDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                minDate={new Date()}
                customInput={
                  <div className="relative w-full">
                    <input 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 pr-10"
                      value={formatDate(date)}
                      readOnly
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Calendar size={16} className="text-gray-400" />
                    </div>
                  </div>
                }
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company <span className="text-red-500">*</span>
            </label>
            <select
              id="company"
              name="company"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              value={company}
              onChange={onChange}
              required
            >
              <option value="">Select a company</option>
              {companies.map(comp => (
                <option key={comp._id} value={comp._id}>
                  {comp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Customer */}
          <div>
            <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">
              Customer <span className="text-red-500">*</span>
            </label>
            <select
              id="customer"
              name="customer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              value={customer}
              onChange={onChange}
              required
              disabled={!selectedCompany}
            >
              <option value="">Select a customer</option>
              {customers.map(cust => (
                <option key={cust._id} value={cust._id}>
                  {cust.name}
                </option>
              ))}
            </select>
            {!selectedCompany && (
              <p className="mt-1 text-sm text-gray-500">Select a company first</p>
            )}
          </div>

          {/* Notes */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              value={notes}
              onChange={onChange}
              placeholder="Add any notes about this appointment..."
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <Link
            to={getBackLink()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="ml-2">Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} className="mr-1" />
                {isEdit ? 'Update Appointment' : 'Create Appointment'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;