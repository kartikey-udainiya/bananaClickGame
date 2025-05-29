import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../config/constants';
import { useAuthStore } from '../store/authStore';
import { useGameStore } from '../store/gameStore';
import { useAdminStore } from '../store/adminStore';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { updatePlayerClickCount, updatePlayerStatus } = useGameStore();
  const { updateUserStatus, updateUserClickCount } = useAdminStore();

  useEffect(() => {
    // Check if user is authenticated before connecting to socket
    if (!isAuthenticated || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Create socket connection with auth token
    const newSocket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Set up event listeners
    newSocket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    // Listen for click count updates
    newSocket.on('click_update', (data) => {
      const { userId, clickCount } = data;
      
      // Update in game store for rankings
      updatePlayerClickCount(userId, clickCount);
      
      // Update in admin store for user management
      updateUserClickCount(userId, clickCount);
    });

    // Listen for user status updates
    newSocket.on('user_status', (data) => {
      const { userId, isOnline } = data;
      
      // Update in game store for rankings
      updatePlayerStatus(userId, isOnline);
      
      // Update in admin store for user management
      updateUserStatus(userId, isOnline);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};