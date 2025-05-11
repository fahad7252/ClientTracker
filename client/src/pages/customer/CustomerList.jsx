import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Search, Plus, ChevronDown, MoreHorizontal, Phone, Mail, Calendar, User } from 'lucide-react';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify';
import axios from 'axios';

const CustomerList = () => {
  const { companyId } = useParams();
  const [customers, setCustomers] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    if (companyId) {
      fetchCompany();
      fetchCustomers();
    }
  }, [companyId]);

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
      const res = await axios.get(`/api/companies/${companyId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCompany(res.data.data);
    } catch (err) {
      console.error('Error fetching company:', err);
      toast.error('Failed to load company details');
    }
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/companies/${companyId}/customers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCustomers(res.data.data);
      setFilteredCustomers(res.data.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          {company && (
            <p className="text-gray-600">
              {company.name} - {customers.length} {customers.length === 1 ? 'Customer' : 'Customers'}
            </p>
          )}
        </div>
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
            to={`/companies/${companyId}/customers/new`}
            className="btn btn-primary flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Add Customer
          </Link>
        </div>
      </div>

      {/* Customer List */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <User size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No customers found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? 'No customers match your search criteria.'
              : 'Get started by adding your first customer.'}
          </p>
          {!searchTerm && (
            <Link to={`/companies/${companyId}/customers/new`} className="btn btn-primary">
              <Plus size={16} className="mr-1" />
              Add Customer
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                            <Link to={`/customers/${customer._id}`} className="hover:text-blue-600">
                              {customer.name}
                            </Link>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 max-w-xs">
                            <div className="line-clamp-2 hover:line-clamp-none cursor-pointer">
                              {customer.notes}
                            </div>
                          </div>
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
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1 text-gray-400" /> 
                        {formatDate(customer.lastContact)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${customer.value?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(customer.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
