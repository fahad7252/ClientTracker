// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   Building, 
//   Users, 
//   DollarSign, 
//   ChevronRight,
//   PieChart,
//   Calendar,
//   Clock
// } from 'lucide-react';
// import axios from 'axios';
// import Spinner from '../../components/common/Spinner';
// import { toast } from 'react-toastify';

// const Dashboard = () => {
//   const [companies, setCompanies] = useState([]);
//   const [recentCustomers, setRecentCustomers] = useState([]);
//   const [stats, setStats] = useState({
//     totalCompanies: 0,
//     totalCustomers: 0,
//     totalValue: 0,
//     statusCounts: {}
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch companies
//         const companiesRes = await axios.get('/api/companies', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         });
//         const companiesData = companiesRes.data.data || [];
//         setCompanies(companiesData);
        
//         // Initialize stats with company data
//         const totalCompanies = companiesData.length;
//         let totalCustomers = 0;
//         let totalValue = 0;
//         const statusCounts = {};
//         const allCustomers = [];
        
//         // Fetch customers for each company and aggregate data
//         for (const company of companiesData) {
//           if (!company._id) continue; // Skip if no ID
          
//           try {
//             const customersRes = await axios.get(`/api/companies/${company._id}/customers`, {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem('token')}`
//               }
//             });
            
//             const companyCustomers = customersRes.data.data || [];
            
//             // Add company info to each customer
//             const customersWithCompany = companyCustomers.map(customer => ({
//               ...customer,
//               companyName: company.name,
//               companyId: company._id
//             }));
            
//             allCustomers.push(...customersWithCompany);
            
//             // Update totals
//             totalCustomers += companyCustomers.length;
//             totalValue += companyCustomers.reduce((sum, customer) => sum + (customer.value || 0), 0);
            
//             // Update status counts
//             companyCustomers.forEach(customer => {
//               statusCounts[customer.status] = (statusCounts[customer.status] || 0) + 1;
//             });
//           } catch (err) {
//             console.error(`Error fetching customers for company ${company._id}:`, err);
//             // Continue with other companies if one fails
//           }
//         }
        
//         setStats({
//           totalCompanies,
//           totalCustomers,
//           totalValue,
//           statusCounts
//         });
        
//         // Sort customers by creation date (newest first) and take the first 5
//         const sortedCustomers = allCustomers.sort(
//           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         ).slice(0, 5);
        
//         setRecentCustomers(sortedCustomers);
//       } catch (err) {
//         console.error('Error fetching dashboard data:', err);
//         toast.error('Failed to load dashboard data');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'Active': return 'bg-green-100 text-green-800';
//       case 'Pending': return 'bg-yellow-100 text-yellow-800';
//       case 'Window Shopper': return 'bg-blue-100 text-blue-800';
//       case 'Deal Closed': return 'bg-purple-100 text-purple-800';
//       case 'Returning Client': return 'bg-indigo-100 text-indigo-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const formatDate = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
//     } catch (error) {
//       return 'Invalid date';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-full">
//         <Spinner size="lg" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
//               <Building size={24} />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Companies</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.totalCompanies}</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
//               <Users size={24} />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Customers</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
//               <DollarSign size={24} />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Value</p>
//               <p className="text-2xl font-bold text-gray-900">${stats.totalValue.toLocaleString()}</p>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Main Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Top Companies */}
//         <div className="lg:col-span-2 bg-white rounded-lg shadow">
//           <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
//             <h2 className="text-lg font-medium text-gray-900 flex items-center">
//               <Building size={20} className="mr-2" />
//               Top Companies
//             </h2>
//             <Link to="/companies" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
//               View All
//               <ChevronRight size={16} />
//             </Link>
//           </div>
          
//           <div className="divide-y divide-gray-200">
//             {companies.length === 0 ? (
//               <div className="p-6 text-center text-gray-500">
//                 No companies found. <Link to="/companies/new" className="text-blue-600 hover:underline">Add a company</Link> to get started.
//               </div>
//             ) : (
//               companies.slice(0, 5).map(company => (
//                 <Link 
//                   key={company._id} 
//                   to={`/companies/${company._id}`}
//                   className="block px-6 py-4 hover:bg-gray-50"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center min-w-0">
//                       <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
//                         <Building size={20} />
//                       </div>
//                       <div className="ml-4 truncate">
//                         <div className="font-medium text-gray-900 truncate">{company.name}</div>
//                         <div className="text-sm text-gray-500">
//                           {company.clientCount || 0} Clients • ${(company.totalValue || 0).toLocaleString()}
//                         </div>
//                       </div>
//                     </div>
//                     <ChevronRight size={16} className="text-gray-400" />
//                   </div>
//                 </Link>
//               ))
//             )}
//           </div>
//         </div>
        
//         {/* Customer Status */}
//         <div className="bg-white rounded-lg shadow">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h2 className="text-lg font-medium text-gray-900 flex items-center">
//               <PieChart size={20} className="mr-2" />
//               Customer Status
//             </h2>
//           </div>
          
//           <div className="p-6">
//             {Object.keys(stats.statusCounts).length === 0 ? (
//               <div className="text-center text-gray-500">
//                 No customer data available.
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {Object.entries(stats.statusCounts).map(([status, count]) => (
//                   <div key={status}>
//                     <div className="flex items-center justify-between mb-1">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
//                         {status}
//                       </span>
//                       <span className="text-sm font-medium text-gray-900">{count}</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div 
//                         className="bg-blue-600 h-2 rounded-full" 
//                         style={{ width: `${(count / stats.totalCustomers) * 100}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
      
//       {/* Recent Activity */}
//       <div className="bg-white rounded-lg shadow">
//         <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
//           <h2 className="text-lg font-medium text-gray-900 flex items-center">
//             <Clock size={20} className="mr-2" />
//             Recent Customers
//           </h2>
//         </div>
        
//         {recentCustomers.length === 0 ? (
//           <div className="p-6 text-center text-gray-500">
//             No recent activity found.
//           </div>
//         ) : (
//           <div className="divide-y divide-gray-200">
//             {recentCustomers.map(customer => (
//               <div key={customer._id} className="px-6 py-4">
//                 <div className="flex items-start">
//                   <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
//                     {customer.name?.charAt(0) || '?'}
//                   </div>
//                   <div className="ml-4">
//                     <div className="flex items-center">
//                       <Link to={`/customers/${customer._id}`} className="font-medium text-gray-900 hover:text-blue-600">
//                         {customer.name}
//                       </Link>
//                       <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
//                         {customer.status}
//                       </span>
//                     </div>
                    
//                     {customer.companyName && (
//                       <Link 
//                         to={`/companies/${customer.companyId}`}
//                         className="text-sm text-blue-600 hover:underline flex items-center mt-1"
//                       >
//                         <Building size={14} className="mr-1" />
//                         {customer.companyName}
//                       </Link>
//                     )}
                    
//                     <div className="mt-1 text-sm text-gray-500">
//                       <span className="flex items-center">
//                         <Calendar size={14} className="mr-1" />
//                         Added on {formatDate(customer.createdAt)}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="ml-auto text-right">
//                     <div className="text-sm font-medium text-gray-900">${(customer.value || 0).toLocaleString()}</div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   Building,
//   Users,
//   DollarSign,
//   ChevronRight,
//   PieChart,
//   Calendar,
//   Clock
// } from 'lucide-react';
// import axios from 'axios';
// import Spinner from '../../components/common/Spinner';
// import { toast } from 'react-toastify';

// const Dashboard = () => {
//   const [companies, setCompanies] = useState([]);
//   const [recentCustomers, setRecentCustomers] = useState([]);
//   const [stats, setStats] = useState({
//     totalCompanies: 0,
//     totalCustomers: 0,
//     totalValue: 0,
//     statusCounts: {}
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const companiesRes = await axios.get('/api/companies', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         const companiesData = companiesRes.data.data || [];
//         setCompanies(companiesData);

//         const totalCompanies = companiesData.length;
//         let totalCustomers = 0;
//         let totalValue = 0;
//         const statusCounts = {};
//         const allCustomers = [];

//         for (const company of companiesData) {
//           if (!company._id) continue;
//           try {
//             const customersRes = await axios.get(`/api/companies/${company._id}/customers`, {
//               headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//             });
//             const companyCustomers = customersRes.data.data || [];
//             const customersWithCompany = companyCustomers.map(customer => ({
//               ...customer,
//               companyName: company.name,
//               companyId: company._id
//             }));
//             allCustomers.push(...customersWithCompany);
//             totalCustomers += companyCustomers.length;
//             totalValue += companyCustomers.reduce((sum, customer) => sum + (customer.value || 0), 0);
//             companyCustomers.forEach(customer => {
//               statusCounts[customer.status] = (statusCounts[customer.status] || 0) + 1;
//             });
//           } catch (err) {
//             console.error(`Error fetching customers for company ${company._id}:`, err);
//           }
//         }

//         setStats({ totalCompanies, totalCustomers, totalValue, statusCounts });

//         const sortedCustomers = allCustomers.sort(
//           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         ).slice(0, 5);
//         setRecentCustomers(sortedCustomers);
//       } catch (err) {
//         console.error('Error fetching dashboard data:', err);
//         toast.error('Failed to load dashboard data');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'Active': return 'bg-green-200 text-green-900';
//       case 'Pending': return 'bg-yellow-200 text-yellow-900';
//       case 'Window Shopper': return 'bg-cyan-200 text-cyan-900';
//       case 'Deal Closed': return 'bg-pink-200 text-pink-900';
//       case 'Returning Client': return 'bg-indigo-200 text-indigo-900';
//       default: return 'bg-gray-200 text-gray-900';
//     }
//   };

//   const formatDate = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
//     } catch {
//       return 'Invalid date';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh] bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
//         <Spinner size="lg" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-10 p-6 md:p-10 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 min-h-screen">
//       <h1 className="text-5xl font-extrabold text-purple-800">Dashboard 👋</h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         {[{
//           label: 'Total Companies',
//           value: stats.totalCompanies,
//           icon: <Building size={26} />, bg: 'bg-blue-200 text-blue-800'
//         }, {
//           label: 'Total Customers',
//           value: stats.totalCustomers,
//           icon: <Users size={26} />, bg: 'bg-green-200 text-green-800'
//         }, {
//           label: 'Total Value',
//           value: `$${stats.totalValue.toLocaleString()}`,
//           icon: <DollarSign size={26} />, bg: 'bg-pink-200 text-pink-800'
//         }].map((card, idx) => (
//           <div key={idx} className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
//             <div className="flex items-center">
//               <div className={`p-4 rounded-full mr-4 shadow-inner ring-4 ring-white ${card.bg}`}>{card.icon}</div>
//               <div>
//                 <p className="text-base text-gray-500 font-semibold">{card.label}</p>
//                 <p className="text-4xl font-black text-gray-900">{card.value}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="bg-white rounded-3xl shadow-2xl p-8">
//         <h2 className="text-2xl font-bold text-purple-800 mb-6">Customer Status Overview</h2>
//         {Object.keys(stats.statusCounts).length > 0 ? (
//           <ul className="space-y-4">
//             {Object.entries(stats.statusCounts).map(([status, count]) => (
//               <li key={status} className="flex justify-between items-center bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl">
//                 <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(status)}`}>{status}</span>
//                 <div className="flex-grow mx-4 h-2 bg-gray-200 rounded-full">
//                   <div className="h-2 rounded-full bg-purple-600" style={{ width: `${(count / stats.totalCustomers) * 100}%` }}></div>
//                 </div>
//                 <span className="font-semibold text-gray-700">{count}</span>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-500">No customer status data available.</p>
//         )}
//       </div>

//       <div className="bg-white rounded-3xl shadow-2xl p-8">
//         <h2 className="text-2xl font-bold text-purple-800 mb-6">Recent Customers</h2>
//         {recentCustomers.length > 0 ? (
//           <ul className="space-y-4">
//             {recentCustomers.map((customer, idx) => (
//               <li key={idx} className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100">
//                 <div>
//                   <p className="font-semibold text-gray-800">{customer.name}</p>
//                   <p className="text-sm text-gray-500">{customer.companyName}</p>
//                 </div>
//                 <div className={`px-3 py-1 text-sm rounded-full ${getStatusColor(customer.status)}`}>{customer.status}</div>
//                 <div className="text-sm text-gray-600">{formatDate(customer.createdAt)}</div>
//                 <Link to={`/customers/${customer._id}`} className="text-purple-600 hover:text-purple-900">
//                   <ChevronRight size={20} />
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-500">No recent customers found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  Users,
  DollarSign,
  ChevronRight,
  PieChart,
  Calendar,
  Clock
} from 'lucide-react';
import axios from 'axios';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalCustomers: 0,
    totalValue: 0,
    statusCounts: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const companiesRes = await axios.get('/api/companies', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const companiesData = companiesRes.data.data || [];
        setCompanies(companiesData);

        const totalCompanies = companiesData.length;
        let totalCustomers = 0;
        let totalValue = 0;
        const statusCounts = {};
        const allCustomers = [];

        for (const company of companiesData) {
          if (!company._id) continue;
          try {
            const customersRes = await axios.get(`/api/companies/${company._id}/customers`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const companyCustomers = customersRes.data.data || [];
            const customersWithCompany = companyCustomers.map(customer => ({
              ...customer,
              companyName: company.name,
              companyId: company._id
            }));
            allCustomers.push(...customersWithCompany);
            totalCustomers += companyCustomers.length;
            totalValue += companyCustomers.reduce((sum, customer) => sum + (customer.value || 0), 0);
            companyCustomers.forEach(customer => {
              statusCounts[customer.status] = (statusCounts[customer.status] || 0) + 1;
            });
          } catch (err) {
            console.error(`Error fetching customers for company ${company._id}:`, err);
          }
        }

        setStats({ totalCompanies, totalCustomers, totalValue, statusCounts });

        const sortedCustomers = allCustomers.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ).slice(0, 5);
        setRecentCustomers(sortedCustomers);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-200 text-green-900';
      case 'Pending': return 'bg-yellow-200 text-yellow-900';
      case 'Window Shopper': return 'bg-cyan-200 text-cyan-900';
      case 'Deal Closed': return 'bg-pink-200 text-pink-900';
      case 'Returning Client': return 'bg-indigo-200 text-indigo-900';
      default: return 'bg-gray-200 text-gray-900';
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 min-h-screen">
      <h1 className="text-3xl font-bold text-purple-800">Dashboard 👋</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[{
          label: 'Total Companies',
          value: stats.totalCompanies,
          icon: <Building size={20} />, bg: 'bg-blue-200 text-blue-800'
        }, {
          label: 'Total Customers',
          value: stats.totalCustomers,
          icon: <Users size={20} />, bg: 'bg-green-200 text-green-800'
        }, {
          label: 'Total Value',
          value: `$${stats.totalValue.toLocaleString()}`,
          icon: <DollarSign size={20} />, bg: 'bg-pink-200 text-pink-800'
        }].map((card, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center">
              <div className={`p-2 rounded-full mr-3 ${card.bg}`}>{card.icon}</div>
              <div>
                <p className="text-xs text-gray-500 font-medium">{card.label}</p>
                <p className="text-xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-purple-800 mb-3">Customer Status Overview</h2>
          {Object.keys(stats.statusCounts).length > 0 ? (
            <ul className="space-y-2">
              {Object.entries(stats.statusCounts).map(([status, count]) => (
                <li key={status} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(status)}`}>{status}</span>
                  <div className="flex-grow mx-2 h-1.5 bg-gray-200 rounded-full">
                    <div className="h-1.5 rounded-full bg-purple-600" style={{ width: `${(count / stats.totalCustomers) * 100}%` }}></div>
                  </div>
                  <span className="font-medium text-xs text-gray-700">{count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No customer status data available.</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-purple-800 mb-3">Recent Customers</h2>
          {recentCustomers.length > 0 ? (
            <ul className="space-y-2">
              {recentCustomers.map((customer, idx) => (
                <li key={idx} className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                  <div className="w-1/3">
                    <p className="font-medium text-sm text-gray-800 truncate">{customer.name}</p>
                    <p className="text-xs text-gray-500 truncate">{customer.companyName}</p>
                  </div>
                  <div className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(customer.status)}`}>{customer.status}</div>
                  <div className="text-xs text-gray-600">{formatDate(customer.createdAt)}</div>
                  <Link to={`/customers/${customer._id}`} className="text-purple-600 hover:text-purple-900">
                    <ChevronRight size={16} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No recent customers found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;