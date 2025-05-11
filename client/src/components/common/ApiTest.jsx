import { useState, useEffect } from 'react';

const ApiTest = () => {
  const [message, setMessage] = useState('Loading...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/test');
        const data = await response.json();
        setMessage(data.message);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to connect to the server. Make sure it\'s running.');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">API Connection Test</h2>
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <p className="text-green-600">Server response: {message}</p>
      )}
    </div>
  );
};

export default ApiTest;
