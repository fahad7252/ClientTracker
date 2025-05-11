import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Save } from 'lucide-react';
import axios from 'axios';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify';

const CustomerForm = ({ isEdit }) => {
  const navigate = useNavigate();
  const { id, companyId } = useParams();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Active',
    value: 0,
    notes: '',
    lastContact: new Date().toISOString().slice(0, 10)
  });
  
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [errors, setErrors] = useState({});
  
  const { name, email, phone, status, value, notes, lastContact } = formData;

  const statusOptions = [
    'Active', 
    'Pending', 
    'Window Shopper', 
    'Deal Closed', 
    'Returning Client'
  ];

  useEffect(() => {
    if (isEdit && id) {
      fetchCustomer();
    } else if (companyId) {
      fetchCompany();
    } else {
      setFetchLoading(false);
      navigate('/dashboard/companies');
    }
  }, [isEdit, id, companyId]);

  const fetchCustomer = async () => {
    try {
      setFetchLoading(true);
      const res = await axios.get(`/api/customers/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const customerData = res.data.data;
      setFormData({
        name: customerData.name || '',
        email: customerData.email || '',
        phone: customerData.phone || '',
        status: customerData.status || 'Active',
        value: customerData.value || 0,
        notes: customerData.notes || '',
        lastContact: customerData.lastContact ? new Date(customerData.lastContact).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
      });
      
      // Fetch company info if customer has a company
      if (customerData.company) {
        try {
          const companyRes = await axios.get(`/api/companies/${customerData.company}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          setCompany(companyRes.data.data);
        } catch (companyErr) {
          console.error('Error fetching company:', companyErr);
          // We don't need to navigate away if company fetch fails
        }
      }
    } catch (err) {
      console.error('Error fetching customer:', err);
      toast.error('Failed to load customer details');
      navigate('/dashboard/companies');
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchCompany = async () => {
    try {
      setFetchLoading(true);
      const res = await axios.get(`/api/companies/${companyId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCompany(res.data.data);
    } catch (err) {
      console.error('Error fetching company:', err);
      toast.error('Failed to load company details');
      // We still want to be able to add customers even if company fetch fails
    } finally {
      setFetchLoading(false);
    }
  };

  const onChange = (e) => {
    const { name, value, type } = e.target;
    
    setFormData({ 
      ...formData, 
      [name]: type === 'number' ? parseFloat(value) || 0 : value 
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Customer name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (value < 0) {
      newErrors.value = 'Value cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    try {
      setLoading(true);
      
      if (isEdit) {
        await axios.put(`/api/customers/${id}`, formData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Customer updated successfully');
        // Navigate to the appropriate page based on available data
        if (company) {
          navigate(`/dashboard/companies/${company._id}`);
        } else {
          navigate('/dashboard/companies');
        }
      } else {
        // Make sure we have a companyId before creating customer
        if (!companyId) {
          toast.error('Company ID is required to create a customer');
          return;
        }
        
        await axios.post(`/api/companies/${companyId}/customers`, formData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Customer created successfully');
        navigate(`/dashboard/companies/${companyId}`);
      }
    } catch (err) {
      console.error('Error saving customer:', err);
      toast.error(
        err.response?.data?.msg || 
        err.response?.data?.errors?.[0]?.msg || 
        `Failed to ${isEdit ? 'update' : 'create'} customer`
      );
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link 
            to={company ? `/dashboard/companies/${company._id}` : '/dashboard/companies'} 
            className="text-gray-500 hover:text-gray-700 mr-4"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Customer' : 'Add Customer'}
          </h1>
        </div>
      </div>

      {company && (
        <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6">
          <p className="text-sm text-blue-700">
            {isEdit ? 'Editing' : 'Adding'} customer for company: <strong>{company.name}</strong>
          </p>
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="form-label">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-input ${errors.name ? 'border-red-300' : ''}`}
              value={name}
              onChange={onChange}
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="form-label">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'border-red-300' : ''}`}
              value={email}
              onChange={onChange}
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              className="form-input"
              value={phone}
              onChange={onChange}
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="form-input"
              value={status}
              onChange={onChange}
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Value */}
          <div>
            <label htmlFor="value" className="form-label">
              Value ($)
            </label>
            <input
              type="number"
              id="value"
              name="value"
              className={`form-input ${errors.value ? 'border-red-300' : ''}`}
              value={value}
              onChange={onChange}
              min="0"
              step="0.01"
            />
            {errors.value && (
              <p className="mt-1 text-sm text-red-600">{errors.value}</p>
            )}
          </div>

          {/* Last Contact Date */}
          <div>
            <label htmlFor="lastContact" className="form-label">
              Last Contact Date
            </label>
            <input
              type="date"
              id="lastContact"
              name="lastContact"
              className="form-input"
              value={lastContact}
              onChange={onChange}
              max={new Date().toISOString().slice(0, 10)}
            />
          </div>

          {/* Notes */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="notes" className="form-label">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="4"
              className="form-input"
              value={notes}
              onChange={onChange}
              placeholder="Add any relevant notes about this customer..."
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <Link
            to={company ? `/dashboard/companies/${company._id}` : '/dashboard/companies'}
            className="btn btn-secondary"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary"
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
                {isEdit ? 'Update Customer' : 'Create Customer'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;