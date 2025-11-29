import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const emailService = {
  // Test SMTP connection
  testConnection: async (smtpConfig) => {
    const response = await apiClient.post('/email/test-connection', { smtpConfig });
    return response.data;
  },

  // Upload Excel file
  uploadExcel: async (file, sheetName = null, columnName = 'email', fullData = false) => {
    const formData = new FormData();
    formData.append('file', file);
    if (sheetName) formData.append('sheetName', sheetName);
    formData.append('columnName', columnName);
    formData.append('fullData', fullData);

    const response = await apiClient.post('/email/upload-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Send emails
  sendEmails: async (smtpConfig, emailData, recipients, recipientsData = null) => {
    const response = await apiClient.post('/email/send', {
      smtpConfig,
      emailData,
      recipients,
      recipientsData,
    });
    return response.data;
  },
};

export default apiClient;

