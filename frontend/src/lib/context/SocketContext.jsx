import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

const SOCKET_URL = "https://mail-sender-lbu4.onrender.com";

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [emailProgress, setEmailProgress] = useState(null);
  const [emailStatus, setEmailStatus] = useState('idle'); // idle, sending, completed, error

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    // Email sending events
    newSocket.on('email-send-start', (data) => {
      console.log('Email sending started:', data);
      setEmailStatus('sending');
      setEmailProgress({
        current: 0,
        total: data.total,
        successful: 0,
        failed: 0,
        message: data.message,
      });
    });

    newSocket.on('email-send-progress', (data) => {
      console.log('Email progress:', data);
      setEmailProgress((prev) => ({
        ...prev,
        current: data.current,
        total: data.total,
        successful: data.successful,
        failed: data.failed,
        lastEmail: data.email,
        lastStatus: data.status,
        lastError: data.error,
      }));
    });

    newSocket.on('email-send-complete', (data) => {
      console.log('Email sending completed:', data);
      setEmailStatus('completed');
      setEmailProgress((prev) => ({
        ...prev,
        current: data.total,
        successful: data.successful,
        failed: data.failed,
        details: data.details,
      }));
    });

    newSocket.on('email-send-error', (data) => {
      console.error('Email sending error:', data);
      setEmailStatus('error');
      setEmailProgress((prev) => ({
        ...prev,
        error: data.error,
      }));
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  const resetProgress = () => {
    setEmailProgress(null);
    setEmailStatus('idle');
  };

  const value = {
    socket,
    isConnected,
    emailProgress,
    emailStatus,
    resetProgress,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};


