// src/pages/company/CompanyList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Building, ChevronRight } from 'lucide-react';
import { companyAPI } from '../../services/api';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter(company => 
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [searchTerm, companies]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await companyAPI.getAllCompanies();
      setCompanies(res.data.data);
      setFilteredCompanies(res.data.data);
    } catch (err) {
      console.error('Error fetching companies:', err);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search companies..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link
            to="/dashboard/companies/new"
            className="btn btn-primary flex items-center"
          >
            <Plus size={16} className="mr-1" />
            <span>Add Company</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : filteredCompanies.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Building size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No companies found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? 'No companies match your search criteria.'
              : 'Get started by adding your first company.'}
          </p>
          {!searchTerm && (
            <Link to="/dashboard/companies/new" className="btn btn-primary">
              <Plus size={16} className="mr-1" />
              Add Company
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden flex-1">
          <ul className="divide-y divide-gray-200">
            {filteredCompanies.map((company) => (
              <li key={company._id}>
                <Link
                  to={`/dashboard/companies/${company._id}`}
                  className="block hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center min-w-0">
                      <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        <Building size={24} />
                      </div>
                      <div className="ml-4 truncate">
                        <div className="font-medium text-gray-900 truncate">{company.name}</div>
                        <div className="text-sm text-gray-500">
                          {company.clientCount || 0} Clients • {company.totalValue ? `$${company.totalValue.toLocaleString()}` : '$0'}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CompanyList;