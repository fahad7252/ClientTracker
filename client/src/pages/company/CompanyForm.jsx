// src/pages/company/CompanyForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building, Save } from 'lucide-react';
import axios from 'axios';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify';

const CompanyForm = ({ isEdit }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    industry: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [errors, setErrors] = useState({});
  
  const { name, description, website, phone, email, address, industry } = formData;

  useEffect(() => {
    if (isEdit && id) {
      fetchCompany();
    }
  }, [isEdit, id]);

  const fetchCompany = async () => {
    try {
      setFetchLoading(true);
      const res = await axios.get(`/api/companies/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const company = res.data.data;
      
      setFormData({
        name: company.name || '',
        description: company.description || '',
        website: company.website || '',
        phone: company.phone || '',
        email: company.email || '',
        address: company.address || '',
        industry: company.industry || ''
      });
    } catch (err) {
      console.error('Error fetching company:', err);
      toast.error('Failed to load company details');
      navigate('/dashboard/companies');
    } finally {
      setFetchLoading(false);
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Company name is required';
    }
    
    if (website && !/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(website)) {
      newErrors.website = 'Please enter a valid URL';
    }
    
    if (email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Format website URL to ensure it has http:// or https://
  const formatWebsiteUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Create a copy of formData with formatted website URL
    const formattedData = {
      ...formData,
      website: formatWebsiteUrl(formData.website)
    };
    
    try {
      setLoading(true);
      
      if (isEdit) {
        await axios.put(`/api/companies/${id}`, formattedData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Company updated successfully');
      } else {
        await axios.post('/api/companies', formattedData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Company created successfully');
      }
      
      navigate('/dashboard/companies');
    } catch (err) {
      console.error('Error saving company:', err);
      toast.error(
        err.response?.data?.msg || 
        err.response?.data?.errors?.[0]?.msg || 
        `Failed to ${isEdit ? 'update' : 'create'} company`
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
          <Link to="/dashboard/companies" className="text-gray-500 hover:text-gray-700 mr-4">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Company' : 'Add Company'}
          </h1>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="name" className="form-label">
              Company Name <span className="text-red-500">*</span>
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

          {/* Description */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              className="form-input"
              value={description}
              onChange={onChange}
            />
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="form-label">
              Website
            </label>
            <div>
              <input
                type="text"
                id="website"
                name="website"
                className={`form-input ${errors.website ? 'border-red-300' : ''}`}
                value={website}
                onChange={onChange}
                placeholder="e.g., company.com or https://company.com"
              />
              <p className="mt-1 text-xs text-gray-500">
                URL will be automatically formatted with https:// if not provided
              </p>
            </div>
            {errors.website && (
              <p className="mt-1 text-sm text-red-600">{errors.website}</p>
            )}
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="industry" className="form-label">
              Industry
            </label>
            <input
              type="text"
              id="industry"
              name="industry"
              className="form-input"
              value={industry}
              onChange={onChange}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'border-red-300' : ''}`}
              value={email}
              onChange={onChange}
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

          {/* Address */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className="form-input"
              value={address}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <Link
            to="/dashboard/companies"
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
                {isEdit ? 'Update Company' : 'Create Company'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyForm;