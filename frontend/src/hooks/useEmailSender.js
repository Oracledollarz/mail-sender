import { useState } from 'react';
import { emailService } from '../lib/api/apiService';

export const useEmailSender = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const testConnection = async (smtpConfig) => {
    setLoading(true);
    setError(null);
    try {
      const response = await emailService.testConnection(smtpConfig);
      setResult(response);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Connection test failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadExcel = async (file, sheetName, columnName, fullData = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await emailService.uploadExcel(file, sheetName, columnName, fullData);
      setResult(response);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'File upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendEmails = async (smtpConfig, emailData, recipients, recipientsData = null) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await emailService.sendEmails(smtpConfig, emailData, recipients, recipientsData);
      setResult(response);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send emails';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setResult(null);
  };

  return {
    loading,
    error,
    result,
    testConnection,
    uploadExcel,
    sendEmails,
    reset,
  };
};

