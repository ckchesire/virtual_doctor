import axios from 'axios';

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle server errors
      console.error('Server error:', error.response.data);
    } else if (error.request) {
      // Handle no response
      console.error('No response received:', error.message);
    } else {
      // Handle other errors
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Export commonly used API endpoints related to consultations
export const consultationApi = {
  // Get a list of consultations
  fetchConsultations: async (params = {}) => {
    try {
      const response = await api.get('/api/consultations/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching consultations:', error);
      throw error;
    }
  },
  
  // Get details of a specific consultation
  fetchConsultationDetails: async (consultationId) => {
    try {
      const response = await api.get(`/api/consultations/${consultationId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching consultation ${consultationId}:`, error);
      throw error;
    }
  },
  
  // Update a consultation (e.g., add notes, change status)
  updateConsultation: async (consultationId, data) => {
    try {
      const response = await api.patch(`/api/consultations/${consultationId}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating consultation ${consultationId}:`, error);
      throw error;
    }
  },
  
  // Get messages for a consultation
  fetchConsultationMessages: async (consultationId) => {
    try {
      const response = await api.get(`/api/consultations/${consultationId}/messages/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching messages for consultation ${consultationId}:`, error);
      throw error;
    }
  },
  
  // Send a message in a consultation
  sendMessage: async (consultationId, content) => {
    try {
      const response = await api.post(`/api/consultations/${consultationId}/messages/`, { content });
      return response.data;
    } catch (error) {
      console.error(`Error sending message in consultation ${consultationId}:`, error);
      throw error;
    }
  }
};

export default api;
