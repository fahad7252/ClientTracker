import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Edit, 
  Trash2, 
  Mail, 
  Phone,
  Calendar,
  Building,
  DollarSign
} from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [customer, setCustomer] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/customers/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const customerData = res.data.data;
      setCustomer(customerData);
      
      // Fetch company details if customer has a company
      if (customerData && customerData.company && typeof customerData.company === 'string') {
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
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async () => {
    try {
      await axios.delete(`/api/customers/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      toast.success('Customer deleted successfully');
      
      // Navigate back to company details
      if (company && company._id) {
        navigate(`/dashboard/companies/${company._id}`);
      } else {
        navigate('/dashboard/companies');
      }
    } catch (err) {
      console.error('Error deleting customer:', err);
      toast.error('Failed to delete customer');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Window Shopper': return 'bg-blue-100 text-blue-800';
      case 'Deal Closed': return 'bg-purple-100 text-purple-800';
      case 'Returning Client': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <User size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">Customer not found</h3>
        <p className="text-gray-500 mb-4">
          The customer you're looking for doesn't exist or has been deleted.
        </p>
        <Link to="/dashboard/companies" className="btn btn-primary">
          Go to Companies
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Customer header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            {company && (
              <Link to={`/dashboard/companies/${company._id}`} className="text-gray-500 hover:text-gray-700 mr-4">
                <ArrowLeft size={20} />
              </Link>
            )}
            <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mr-4">
              {customer.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
              <div className="flex items-center mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                  {customer.status}
                </span>
                {company && (
                  <Link 
                    to={`/dashboard/companies/${company._id}`}
                    className="ml-3 text-sm text-gray-500 hover:text-gray-700 flex items-center"
                  >
                    <Building size={14} className="mr-1" />
                    {company.name}
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-2 w-full md:w-auto">
            <Link
              to={`/dashboard/customers/${id}/edit`}
              className="btn btn-secondary flex items-center"
            >
              <Edit size={16} className="mr-1" />
              Edit
            </Link>
            <button
              className="btn btn-danger flex items-center"
              onClick={() => setDeleteModal(true)}
            >
              <Trash2 size={16} className="mr-1" />
              Delete
            </button>
          </div>
        </div>

        {/* Customer details */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Mail size={18} className="mr-2 text-gray-400" />
                <a href={`mailto:${customer.email}`} className="text-blue-600 hover:underline">
                  {customer.email}
                </a>
              </div>
              {customer.phone && (
                <div className="flex items-center text-gray-600">
                  <Phone size={18} className="mr-2 text-gray-400" />
                  <a href={`tel:${customer.phone}`} className="hover:text-gray-900">
                    {customer.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Customer Details</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <DollarSign size={18} className="mr-2 text-gray-400" />
                <span className="font-medium">${(customer.value || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar size={18} className="mr-2 text-gray-400" />
                <span>Last Contact: {formatDate(customer.lastContact)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {customer.notes && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Notes</h3>
            <div className="bg-gray-50 p-4 rounded-md text-gray-700 whitespace-pre-line">
              {customer.notes}
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
          <div>
            <span>Added on </span>
            <time dateTime={customer.createdAt}>
              {formatDate(customer.createdAt)}
            </time>
          </div>
          {customer.updatedAt && customer.updatedAt !== customer.createdAt && (
            <div>
              <span>Last updated </span>
              <time dateTime={customer.updatedAt}>
                {formatDate(customer.updatedAt)}
              </time>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Customer</h3>
            <p className="text-gray-500 mb-4">
              Are you sure you want to delete <strong>{customer.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteCustomer}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;