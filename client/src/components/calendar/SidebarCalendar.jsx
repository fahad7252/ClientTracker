// src/components/calendar/SidebarCalendar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, Plus } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';

const SidebarCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch dates with appointments for the current month
    fetchHighlightedDates(selectedDate);
  }, [selectedDate]);

  // Consistent date formatter used across components
  const formatDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchHighlightedDates = async (date) => {
    try {
      setLoading(true);
      // Calculate first and last day of the month (in browser's timezone)
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      // Format dates consistently
      const firstDayFormatted = formatDateString(firstDay);
      const lastDayFormatted = formatDateString(lastDay);
      
      const res = await axios.get('/api/appointments', {
        params: {
          startDate: firstDayFormatted,
          endDate: lastDayFormatted
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Extract dates from appointments
      const dates = res.data.data.map(appointment => {
        // Create date objects that will be consistent with UI display
        const dateParts = appointment.date.split('T')[0].split('-');
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // JavaScript months are 0-based
        const day = parseInt(dateParts[2]);
        return new Date(year, month, day);
      });
      
      // Remove duplicates
      const uniqueDates = [...new Set(dates.map(date => formatDateString(date)))].map(dateStr => {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
      });
      
      setHighlightedDates(uniqueDates);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    
    // Use consistent date formatting for navigation
    const formattedDate = formatDateString(date);
    navigate(`/dashboard/appointments/${formattedDate}`);
  };

  // Custom day rendering to highlight days with appointments
  const renderDayContents = (day, date) => {
    // Compare dates based on year, month, day only (not time)
    const isHighlighted = highlightedDates.some(
      highlightedDate => 
        highlightedDate.getDate() === date.getDate() &&
        highlightedDate.getMonth() === date.getMonth() &&
        highlightedDate.getFullYear() === date.getFullYear()
    );
    
    return (
      <div className={`relative ${isHighlighted ? 'font-bold text-purple-600' : ''}`}>
        {date.getDate()}
        {isHighlighted && <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-purple-600 rounded-full shadow-sm"></div>}
      </div>
    );
  };

  // Custom styling for the DatePicker
  const customDatePickerStyles = `
    .react-datepicker {
      font-family: 'Inter', sans-serif;
      border-radius: 0.75rem;
      border: none;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      width: 100%;
    }
    .react-datepicker__month-container {
      width: 100%;
    }
    .react-datepicker__month {
      margin: 0.2rem 0;
    }
    .react-datepicker__week {
      display: flex;
      justify-content: space-around;
      width: 100%;
    }
    .react-datepicker__day {
      margin: 0.1rem;
      width: 1.5rem;
      line-height: 1.5rem;
      flex: 1;
    }
    .react-datepicker__day-names {
      display: flex;
      justify-content: space-around;
      width: 100%;
    }
    .react-datepicker__header {
      background: linear-gradient(to right, #f0e7ff, #fce7f3);
      border-bottom: 1px solid #f3e8ff;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }
    .react-datepicker__navigation {
      top: 0.5rem;
    }
    .react-datepicker__day--selected {
      background: linear-gradient(to right, #8b5cf6, #ec4899);
      border-radius: 9999px;
      color: white;
      font-weight: bold;
    }
    .react-datepicker__day:hover {
      background-color: #f3e8ff;
      border-radius: 9999px;
    }
    .react-datepicker__day--keyboard-selected {
      background-color: #f3e8ff;
      border-radius: 9999px;
    }
    .react-datepicker__day-name {
      color: #6b7280;
      font-weight: 500;
      margin: 0.1rem;
      width: 1.5rem;
      flex: 1;
      text-align: center;
    }
    .react-datepicker__current-month {
      color: #4b5563;
      font-weight: 600;
      margin-bottom: 0.3rem;
      font-size: 0.9rem;
    }
  `;

  return (
    <div className="p-2">
      <style>{customDatePickerStyles}</style>
      
      <h2 className="font-semibold text-purple-800 mb-2 flex items-center">
        <div className="p-1 rounded-md bg-purple-100 text-purple-600 shadow-sm mr-2">
          <Calendar size={14} />
        </div>
        Calendar
      </h2>
      
      <div className="rounded-xl overflow-visible shadow-md w-full">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          inline
          renderDayContents={renderDayContents}
          calendarClassName="border-0 w-full"
          dayClassName={date => 
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear()
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full"
              : ""
          }
        />
      </div>
      
      <div className="mt-3 flex justify-center">
        <Link 
          to="/dashboard/appointments/new"
          className="py-1.5 px-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center w-full"
        >
          <Plus size={14} className="mr-1" />
          New Appointment
        </Link>
      </div>
    </div>
  );
};

export default SidebarCalendar;