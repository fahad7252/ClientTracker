// src/pages/company/CompanyDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building, 
  Edit, 
  Trash2, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  Users, 
  Plus,
  Search,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify';

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [company, setCompany] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerLoading, setCustomerLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCompany();
      fetchCustomers();
    }
  }, [id]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.notes && customer.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/companies/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCompany(res.data.data);
    } catch (err) {
      console.error('Error fetching company:', err);
      toast.error('Failed to load company details');
      navigate('/dashboard/companies');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      setCustomerLoading(true);
      const res = await axios.get(`/api/companies/${id}/customers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCustomers(res.data.data || []);
      setFilteredCustomers(res.data.data || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
      toast.error('Failed to load customers');
    } finally {
      setCustomerLoading(false);
    }
  };

  const handleDeleteCompany = async () => {
    try {
      await axios.delete(`/api/companies/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Company deleted successfully');
      navigate('/dashboard/companies');
    } catch (err) {
      console.error('Error deleting company:', err);
      toast.error('Failed to delete company');
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

  // Function to truncate text
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Company header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Link to="/dashboard/companies" className="text-gray-500 hover:text-gray-700 mr-4">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-4">
              <Building size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              <p className="text-gray-500">
                {customers.length} {customers.length === 1 ? 'Customer' : 'Customers'}
              </p>
            </div>
          </div>
          <div className="flex space-x-2 w-full md:w-auto">
            <Link
              to={`/dashboard/companies/${id}/edit`}
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

        {company.description && (
          <div className="mt-4">
            <p className="text-gray-700">{company.description}</p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {company.website && (
            <div className="flex items-center text-gray-600">
              <Globe size={18} className="mr-2 text-gray-400" />
              <a 
                href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {company.website}
              </a>
            </div>
          )}
          {company.phone && (
            <div className="flex items-center text-gray-600">
              <Phone size={18} className="mr-2 text-gray-400" />
              <a href={`tel:${company.phone}`} className="hover:text-gray-900">
                {company.phone}
              </a>
            </div>
          )}
          {company.email && (
            <div className="flex items-center text-gray-600">
              <Mail size={18} className="mr-2 text-gray-400" />
              <a href={`mailto:${company.email}`} className="text-blue-600 hover:underline">
                {company.email}
              </a>
            </div>
          )}
          {company.address && (
            <div className="flex items-center text-gray-600 col-span-1 md:col-span-3">
              <MapPin size={18} className="mr-2 text-gray-400 flex-shrink-0" />
              <span>{company.address}</span>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
          <div>
            <span>Added on </span>
            <time dateTime={company.createdAt}>
              {formatDate(company.createdAt)}
            </time>
          </div>
          {company.industry && (
            <div className="bg-gray-100 px-3 py-1 rounded-full">
              {company.industry}
            </div>
          )}
        </div>
      </div>

      {/* Customers section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <Users size={20} className="mr-2" />
            Customers
          </h2>
          <div className="flex space-x-2 w-full md:w-auto mt-3 md:mt-0">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search customers..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link
              to={`/dashboard/companies/${id}/customers/new`}
              className="btn btn-primary flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Add Customer
            </Link>
          </div>
        </div>

        {customerLoading ? (
          <Spinner />
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-8">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No customers found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? 'No customers match your search criteria.'
                : 'Get started by adding your first customer.'}
            </p>
            {!searchTerm && (
              <Link to={`/dashboard/companies/${id}/customers/new`} className="btn btn-primary">
                <Plus size={16} className="mr-1" />
                Add Customer
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                    Customer <ChevronDown size={14} className="ml-1" />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added On
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            <Link to={`/dashboard/customers/${customer._id}`} className="hover:text-blue-600">
                              {customer.name}
                            </Link>
                          </div>
                          {customer.notes && (
                            <div className="text-xs text-gray-500 mt-1 max-w-xs">
                              <div className="flex items-start">
                                <div className="mr-1">{truncateText(customer.notes, 60)}</div>
                                <Link 
                                  to={`/dashboard/customers/${customer._id}`} 
                                  className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                                >
                                  <span className="mr-0.5 whitespace-nowrap">Read More</span>
                                  <ExternalLink size={12} />
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail size={14} className="mr-1 text-gray-400" /> 
                        <a href={`mailto:${customer.email}`} className="hover:text-blue-600">
                          {customer.email}
                        </a>
                      </div>
                      {customer.phone && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone size={14} className="mr-1 text-gray-400" /> 
                          <a href={`tel:${customer.phone}`} className="hover:text-gray-900">
                            {customer.phone}
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(customer.lastContact)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${(customer.value || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(customer.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/dashboard/customers/${customer._id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Company</h3>
            <p className="text-gray-500 mb-4">
              Are you sure you want to delete <strong>{company.name}</strong>? This action cannot be undone and will also delete all customer data associated with this company.
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
                onClick={handleDeleteCompany}
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

export default CompanyDetails;