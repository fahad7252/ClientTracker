import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data helper function
  const loadUserData = async () => {
    try {
      const res = await authAPI.getCurrentUser();
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Error loading user data:', err);
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      setError('Session expired. Please login again.');
      toast.error('Session expired. Please login again.');
    }
  };

  // Load user on first render
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check if token exists
        if (localStorage.getItem('token')) {
          await loadUserData();
        }
      } catch (err) {
        console.error('Error loading user:', err);
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await authAPI.register(userData);
      
      // Set token in local storage
      localStorage.setItem('token', res.data.token);
      
      // Load user
      await loadUserData();
      
      toast.success('Registration successful!');
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.msg || 
        err.response?.data?.errors?.[0]?.msg || 
        'Registration failed'
      );
      toast.error(
        err.response?.data?.msg || 
        err.response?.data?.errors?.[0]?.msg || 
        'Registration failed'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      let token;
      
      // If token is directly provided (from password reset)
      if (typeof credentials === 'string' || credentials.token) {
        token = typeof credentials === 'string' ? credentials : credentials.token;
        localStorage.setItem('token', token);
      } else {
        // Regular login with email/password
        const res = await authAPI.login(credentials);
        token = res.data.token;
        localStorage.setItem('token', token);
      }
      
      // Load user
      await loadUserData();
      
      toast.success('Login successful!');
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.msg || 
        err.response?.data?.errors?.[0]?.msg || 
        'Login failed'
      );
      toast.error(
        err.response?.data?.msg || 
        err.response?.data?.errors?.[0]?.msg || 
        'Login failed'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      toast.info('Logged out successfully');
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      // Since authAPI.forgotPassword doesn't exist yet, we'll use axios directly for now
      // This will be replaced once you update your API service
      const axios = authAPI.getAxiosInstance ? authAPI.getAxiosInstance() : require('axios').default;
      await axios.post('/api/auth/forgotpassword', { email });
      
      return true;
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(
        err.response?.data?.msg || 
        err.response?.data?.errors?.[0]?.msg || 
        'Failed to send reset email'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (resetToken, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Similar to above, use axios directly until API service is updated
      const axios = authAPI.getAxiosInstance ? authAPI.getAxiosInstance() : require('axios').default;
      const res = await axios.put(`/api/auth/resetpassword/${resetToken}`, { password });
      
      // Set the new token
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        
        // Load user data with the new token
        await loadUserData();
        
        toast.success('Password reset successful!');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Reset password error:', err);
      setError(
        err.response?.data?.msg || 
        err.response?.data?.errors?.[0]?.msg || 
        'Password reset failed'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        forgotPassword,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;