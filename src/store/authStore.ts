import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../config/constants';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'player';
  isBlocked: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { username, password });
      const { token, user } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Update state
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },
  
  register: async (username: string, password: string, role: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { username, password, role });
      const { token, user } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Update state
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },
  
  logout: () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Update state
    set({ 
      user: null, 
      isAuthenticated: false,
      error: null 
    });
  },
  
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }
    
    set({ isLoading: true });
    try {
      // Set token in headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Verify token and get user data
      const response = await axios.get(`${API_URL}/auth/me`);
      
      set({ 
        user: response.data.user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
    } catch (err) {
      // Clear invalid token
      localStorage.removeItem('token');
      
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null
      });
    }
  },
}));