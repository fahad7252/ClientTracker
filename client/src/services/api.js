import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getCurrentUser: () => api.get("/auth/me"),
  logout: () => api.get("/auth/logout"),
  forgotPassword: (email) => axios.post("/api/auth/forgotpassword", { email }),
  resetPassword: (resetToken, password) =>
    axios.put(`/api/auth/resetpassword/${resetToken}`, { password }),
};

// Company API
export const companyAPI = {
  getAllCompanies: () => api.get("/companies"),
  getCompany: (id) => api.get(`/companies/${id}`),
  createCompany: (data) => api.post("/companies", data),
  updateCompany: (id, data) => api.put(`/companies/${id}`, data),
  deleteCompany: (id) => api.delete(`/companies/${id}`),
};

// Customer API
export const customerAPI = {
  getAllCustomers: () => api.get("/customers"),
  getCompanyCustomers: (companyId) =>
    api.get(`/companies/${companyId}/customers`),
  getCustomer: (id) => api.get(`/customers/${id}`),
  createCustomer: (companyId, data) =>
    api.post(`/companies/${companyId}/customers`, data),
  updateCustomer: (id, data) => api.put(`/customers/${id}`, data),
  deleteCustomer: (id) => api.delete(`/customers/${id}`),
};

export default api;
