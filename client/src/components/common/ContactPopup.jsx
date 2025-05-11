// src/components/common/ContactPopup.jsx
import React from 'react';
import { X } from 'lucide-react';

const ContactPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Password Reset
        </h2>
        
        <p className="text-gray-600 mb-4">
          To reset your password, please contact us at:
        </p>
        
        <div className="text-center mb-4">
          
            skr_fah@hotmail.com
         
          
          
          
        </div>
        
        <p className="text-gray-500 text-sm">
          Please include your username or email address in your message, and we will help you reset your password.
        </p>
        
        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ContactPopup;