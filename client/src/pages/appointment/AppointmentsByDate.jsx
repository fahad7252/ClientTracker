// import React, { useState, useEffect } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { Calendar, Users, Clock, ArrowLeft, Building, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
// import axios from 'axios';
// import Spinner from '../../components/common/Spinner';
// import { toast } from 'react-toastify';
// import { format } from 'date-fns';
// import { DateTime } from "luxon";

// const AppointmentsByDate = () => {
//   const { date } = useParams();
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [customers, setCustomers] = useState([]);
//   const navigate = useNavigate();

//   // Fixed date parsing - create a DateTime object with the specified format in local timezone
//   // Important: the 'local' option ensures it doesn't shift due to timezone
//   const parsedDate = date 
//     ? DateTime.fromFormat(date, 'yyyy-MM-dd', { zone: 'local' }).toJSDate() 
//     : new Date();
    
//   // Display the formatted date
//   const formattedDate = format(parsedDate, 'MMMM d, yyyy');

//   // Navigation with fixed handling to avoid timezone shifts
//   const goToPrevDay = () => {
//     if (!date) return;
    
//     // Split the date string directly instead of date object manipulation
//     const [year, month, day] = date.split('-').map(Number);
    
//     // Create a new DateTime object in local timezone and subtract one day
//     const prevDay = DateTime.local(year, month, day).minus({ days: 1 });
//     const formattedPrevDay = prevDay.toFormat('yyyy-MM-dd');
    
//     navigate(`/appointments/${formattedPrevDay}`);
//   };

//   const goToNextDay = () => {
//     if (!date) return;
    
//     // Split the date string directly instead of date object manipulation
//     const [year, month, day] = date.split('-').map(Number);
    
//     // Create a new DateTime object in local timezone and add one day
//     const nextDay = DateTime.local(year, month, day).plus({ days: 1 });
//     const formattedNextDay = nextDay.toFormat('yyyy-MM-dd');
    
//     navigate(`/appointments/${formattedNextDay}`);
//   };

//   useEffect(() => {
//     if (date) {
//       fetchAppointments();
//       fetchCustomers();
//     }
//   }, [date]);

//   const fetchAppointments = async () => {
//     try {
//       setLoading(true);
//       // Use the exact date from URL parameter without any conversion
//       const res = await axios.get(`/api/appointments/date/${date}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       setAppointments(res.data.data);
//     } catch (err) {
//       console.error('Error fetching appointments:', err);
//       toast.error('Failed to load appointments');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCustomers = async () => {
//     try {
//       // Use the exact date from URL parameter without any conversion
//       const customersRes = await axios.get('/api/customers', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         },
//         params: {
//           lastContact: date
//         }
//       });
//       setCustomers(customersRes.data.data || []);
//     } catch (err) {
//       console.error('Error fetching customers:', err);
//       toast.error('Failed to load customer interactions');
//     }
//   };

//   // Format time with explicit timezone handling
//   const formatTime = (dateString) => {
//     try {
//       if (!dateString) return 'No time';
      
//       // Parse with local timezone to avoid shifts
//       return DateTime.fromISO(dateString, { zone: 'local' }).toFormat('h:mm a');
//     } catch (error) {
//       return 'Invalid time';
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
//     <div className="space-y-4">
//       {/* Header section with navigation */}
//       <div className="bg-white rounded-xl shadow-md p-4 mb-4">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//           <div className="flex items-center">
//             <Link to="/" className="p-1.5 rounded-lg bg-gray-100 text-purple-600 hover:bg-purple-100 mr-4 transition-colors duration-200">
//               <ArrowLeft size={18} />
//             </Link>
//             <h1 className="text-2xl font-bold text-purple-800">Appointments</h1>
//           </div>
          
//           <div className="flex items-center mt-4 md:mt-0">
//             <button 
//               onClick={goToPrevDay}
//               className="p-1.5 rounded-lg bg-gray-100 text-purple-600 hover:bg-purple-100 transition-colors duration-200"
//             >
//               <ChevronLeft size={18} />
//             </button>
            
//             <div className="flex items-center mx-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-4 py-1.5 rounded-lg shadow-sm">
//               <Calendar size={16} className="mr-2" />
//               {formattedDate}
//             </div>
            
//             <button 
//               onClick={goToNextDay}
//               className="p-1.5 rounded-lg bg-gray-100 text-purple-600 hover:bg-purple-100 transition-colors duration-200"
//             >
//               <ChevronRight size={18} />
//             </button>
//           </div>
          
//           <Link 
//             to="/appointments/new" 
//             className="py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center mt-4 md:mt-0"
//           >
//             <Plus size={16} className="mr-1" />
//             New Appointment
//           </Link>
//         </div>
//       </div>

//       {/* Appointments Section */}
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <h2 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
//           <div className="p-1.5 rounded-md bg-blue-100 text-blue-600 shadow-sm mr-2">
//             <Clock size={16} />
//           </div>
//           Appointments
//         </h2>

//         {appointments.length === 0 ? (
//           <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
//             No appointments scheduled for this date.
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {appointments.map(appointment => (
//               <div 
//                 key={appointment._id} 
//                 className="border-l-4 border-purple-500 pl-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-r-lg hover:shadow-md transition-shadow duration-200"
//               >
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="font-semibold text-gray-900">{appointment.title}</h3>
//                     <div className="text-sm text-gray-600 flex items-center mt-1">
//                       <div className="p-1 rounded-full bg-purple-100 text-purple-600 mr-1">
//                         <Clock size={12} />
//                       </div>
//                       {formatTime(appointment.date)}
//                     </div>
//                     {appointment.customer && (
//                       <Link 
//                         to={`/customers/${appointment.customer._id}`}
//                         className="text-sm text-purple-600 hover:text-purple-800 flex items-center mt-1"
//                       >
//                         <div className="p-1 rounded-full bg-purple-100 text-purple-600 mr-1">
//                           <Users size={12} />
//                         </div>
//                         {appointment.customer.name}
//                       </Link>
//                     )}
//                     {appointment.company && (
//                       <div className="text-sm text-gray-600 flex items-center mt-1">
//                         <div className="p-1 rounded-full bg-purple-100 text-purple-600 mr-1">
//                           <Building size={12} />
//                         </div>
//                         {appointment.company.name}
//                       </div>
//                     )}
//                   </div>
//                   {appointment.notes && (
//                     <div className="bg-white p-2 rounded-lg text-sm text-gray-700 max-w-xs shadow-sm">
//                       {appointment.notes}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Customer Interactions Section */}
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <h2 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
//           <div className="p-1.5 rounded-md bg-green-100 text-green-600 shadow-sm mr-2">
//             <Users size={16} />
//           </div>
//           Customer Interactions
//         </h2>

//         {customers.length === 0 ? (
//           <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
//             No customer interactions recorded for this date.
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {customers.map(customer => (
//               <Link 
//                 key={customer._id} 
//                 to={`/customers/${customer._id}`}
//                 className="block bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100 hover:shadow-md transition-all duration-200"
//               >
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white shadow-sm">
//                     {customer.name.charAt(0)}
//                   </div>
//                   <div className="ml-3">
//                     <div className="font-medium text-gray-900">{customer.name}</div>
//                     <div className="text-sm text-gray-600">{customer.email}</div>
//                   </div>
//                 </div>
//                 <div className="mt-2">
//                   <span className={`px-2 py-1 text-xs font-semibold rounded-full shadow-sm ${getStatusColor(customer.status)}`}>
//                     {customer.status}
//                   </span>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Helper function for status colors
// const getStatusColor = (status) => {
//   switch(status) {
//     case 'Active': return 'bg-green-100 text-green-800';
//     case 'Pending': return 'bg-yellow-100 text-yellow-800';
//     case 'Window Shopper': return 'bg-cyan-100 text-cyan-800';
//     case 'Deal Closed': return 'bg-pink-100 text-pink-800';
//     case 'Returning Client': return 'bg-indigo-100 text-indigo-800';
//     default: return 'bg-gray-100 text-gray-800';
//   }
// };

// export default AppointmentsByDate;




// src/pages/appointment/AppointmentsByDate.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, Clock, ArrowLeft, Building, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify';
import { format, parseISO } from 'date-fns';

const AppointmentsByDate = () => {
  const { date } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  // Function to parse dates from URL parameter without timezone conversion
  const getDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    
    // Direct string manipulation to get date parts
    const [year, month, day] = dateStr.split('-').map(Number);
    
    // Create a date display string manually using these parts
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[month-1]} ${day}, ${year}`;
  };
  
  // Display the date from URL directly without Date object conversion
  const formattedDate = getDateDisplay(date);

  // Navigation functions working with direct string manipulation
  const goToPrevDay = () => {
    if (!date) return;
    
    // Parse the date string directly
    const [year, month, day] = date.split('-').map(Number);
    
    // Create a new Date object for calculations only
    const prevDate = new Date(year, month - 1, day);
    prevDate.setDate(prevDate.getDate() - 1);
    
    // Format the new date string manually to avoid timezone issues
    const prevYear = prevDate.getFullYear();
    const prevMonth = String(prevDate.getMonth() + 1).padStart(2, '0');
    const prevDay = String(prevDate.getDate()).padStart(2, '0');
    
    navigate(`/dashboard/appointments/${prevYear}-${prevMonth}-${prevDay}`);
  };

  const goToNextDay = () => {
    if (!date) return;
    
    // Parse the date string directly
    const [year, month, day] = date.split('-').map(Number);
    
    // Create a new Date object for calculations only
    const nextDate = new Date(year, month - 1, day);
    nextDate.setDate(nextDate.getDate() + 1);
    
    // Format the new date string manually to avoid timezone issues
    const nextYear = nextDate.getFullYear();
    const nextMonth = String(nextDate.getMonth() + 1).padStart(2, '0');
    const nextDay = String(nextDate.getDate()).padStart(2, '0');
    
    navigate(`/dashboard/appointments/${nextYear}-${nextMonth}-${nextDay}`);
  };

  useEffect(() => {
    if (date) {
      fetchAppointments();
      fetchCustomers();
    }
  }, [date]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      // Use the exact date string from URL parameter
      const res = await axios.get(`/api/appointments/date/${date}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAppointments(res.data.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      // Use the exact date string from URL parameter
      const customersRes = await axios.get('/api/customers', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params: {
          lastContact: date
        }
      });
      setCustomers(customersRes.data.data || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
      toast.error('Failed to load customer interactions');
    }
  };

  // Format time without timezone conversion
  const formatTime = (dateString) => {
    try {
      if (!dateString) return 'No time';
      
      // Create a date object directly from the string
      const timeDate = new Date(dateString);
      
      // Format hours and minutes directly
      let hours = timeDate.getHours();
      const minutes = String(timeDate.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      
      // Convert to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      
      return `${hours}:${minutes} ${ampm}`;
    } catch (error) {
      return 'Invalid time';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header section with navigation */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center">
            <Link to="/dashboard" className="p-1.5 rounded-lg bg-gray-100 text-purple-600 hover:bg-purple-100 mr-4 transition-colors duration-200">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-2xl font-bold text-purple-800">Appointments</h1>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0">
            <button 
              onClick={goToPrevDay}
              className="p-1.5 rounded-lg bg-gray-100 text-purple-600 hover:bg-purple-100 transition-colors duration-200"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex items-center mx-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-4 py-1.5 rounded-lg shadow-sm">
              <Calendar size={16} className="mr-2" />
              {formattedDate}
            </div>
            
            <button 
              onClick={goToNextDay}
              className="p-1.5 rounded-lg bg-gray-100 text-purple-600 hover:bg-purple-100 transition-colors duration-200"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          
          <Link 
            to="/dashboard/appointments/new" 
            className="py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center mt-4 md:mt-0"
          >
            <Plus size={16} className="mr-1" />
            New Appointment
          </Link>
        </div>
      </div>

      {/* Appointments Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
          <div className="p-1.5 rounded-md bg-blue-100 text-blue-600 shadow-sm mr-2">
            <Clock size={16} />
          </div>
          Appointments
        </h2>

        {appointments.length === 0 ? (
          <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
            No appointments scheduled for this date.
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map(appointment => (
              <div 
                key={appointment._id} 
                className="border-l-4 border-purple-500 pl-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-r-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      to={`/dashboard/appointments/${appointment._id}/edit`}
                      className="font-semibold text-gray-900 hover:text-purple-600"
                    >
                      {appointment.title}
                    </Link>
                    <div className="text-sm text-gray-600 flex items-center mt-1">
                      <div className="p-1 rounded-full bg-purple-100 text-purple-600 mr-1">
                        <Clock size={12} />
                      </div>
                      {formatTime(appointment.date)}
                    </div>
                    {appointment.customer && (
                      <Link 
                        to={`/dashboard/customers/${appointment.customer._id}`}
                        className="text-sm text-purple-600 hover:text-purple-800 flex items-center mt-1"
                      >
                        <div className="p-1 rounded-full bg-purple-100 text-purple-600 mr-1">
                          <Users size={12} />
                        </div>
                        {appointment.customer.name}
                      </Link>
                    )}
                    {appointment.company && (
                      <Link
                        to={`/dashboard/companies/${appointment.company._id || appointment.company}`}
                        className="text-sm text-gray-600 hover:text-purple-600 flex items-center mt-1"
                      >
                        <div className="p-1 rounded-full bg-purple-100 text-purple-600 mr-1">
                          <Building size={12} />
                        </div>
                        {appointment.company.name || 'Company'}
                      </Link>
                    )}
                  </div>
                  {appointment.notes && (
                    <div className="bg-white p-2 rounded-lg text-sm text-gray-700 max-w-xs shadow-sm">
                      {appointment.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer Interactions Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
          <div className="p-1.5 rounded-md bg-green-100 text-green-600 shadow-sm mr-2">
            <Users size={16} />
          </div>
          Customer Interactions
        </h2>

        {customers.length === 0 ? (
          <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
            No customer interactions recorded for this date.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers.map(customer => (
              <Link 
                key={customer._id} 
                to={`/dashboard/customers/${customer._id}`}
                className="block bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white shadow-sm">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">{customer.name}</div>
                    <div className="text-sm text-gray-600">{customer.email}</div>
                  </div>
                </div>
                <div className="mt-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full shadow-sm ${getStatusColor(customer.status)}`}>
                    {customer.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function for status colors
const getStatusColor = (status) => {
  switch(status) {
    case 'Active': return 'bg-green-100 text-green-800';
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    case 'Window Shopper': return 'bg-cyan-100 text-cyan-800';
    case 'Deal Closed': return 'bg-pink-100 text-pink-800';
    case 'Returning Client': return 'bg-indigo-100 text-indigo-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default AppointmentsByDate;