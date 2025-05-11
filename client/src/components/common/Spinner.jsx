import React from 'react';

const Spinner = ({ size = 'default' }) => {
  const sizeClass = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClass[size]}`}></div>
    </div>
  );
};

export default Spinner;