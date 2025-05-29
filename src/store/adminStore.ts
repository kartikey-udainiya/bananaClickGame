import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../config/constants';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'player';
  clickCount: number;
  isOnline: boolean;
  isBlocked: boolean;
  createdAt: string;
}

interface AdminState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  createUser: (userData: { username: string; password: string; role: string }) => Promise<void>;
  updateUser: (userId: string, userData: { username?: string; role?: string; isBlocked?: boolean }) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  updateUserStatus: (userId: string, isOnline: boolean) => void;
  updateUserClickCount: (userId: string, clickCount: number) => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/admin/users`);
      set({ 
        users: response.data.users,
        isLoading: false
      });
    } catch (err) {
      set({ 
        isLoading: false,
        error: 'Failed to fetch users'
      });
    }
  },
  
  createUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/admin/users`, userData);
      set(state => ({ 
        users: [...state.users, response.data.user],
        isLoading: false
      }));
    } catch (err) {
      set({ 
        isLoading: false,
        error: 'Failed to create user'
      });
      throw new Error('Failed to create user');
    }
  },
  
  updateUser: async (userId, userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/admin/users/${userId}`, userData);
      set(state => ({ 
        users: state.users.map(user => 
          user.id === userId ? { ...user, ...response.data.user } : user
        ),
        selectedUser: state.selectedUser?.id === userId ? 
          { ...state.selectedUser, ...response.data.user } : state.selectedUser,
        isLoading: false
      }));
    } catch (err) {
      set({ 
        isLoading: false,
        error: 'Failed to update user'
      });
      throw new Error('Failed to update user');
    }
  },
  
  deleteUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/admin/users/${userId}`);
      set(state => ({ 
        users: state.users.filter(user => user.id !== userId),
        selectedUser: state.selectedUser?.id === userId ? null : state.selectedUser,
        isLoading: false
      }));
    } catch (err) {
      set({ 
        isLoading: false,
        error: 'Failed to delete user'
      });
      throw new Error('Failed to delete user');
    }
  },
  
  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },
  
  updateUserStatus: (userId, isOnline) => {
    set(state => ({
      users: state.users.map(user => 
        user.id === userId ? { ...user, isOnline } : user
      ),
      selectedUser: state.selectedUser?.id === userId ? 
        { ...state.selectedUser, isOnline } : state.selectedUser
    }));
  },
  
  updateUserClickCount: (userId, clickCount) => {
    set(state => ({
      users: state.users.map(user => 
        user.id === userId ? { ...user, clickCount } : user
      ),
      selectedUser: state.selectedUser?.id === userId ? 
        { ...state.selectedUser, clickCount } : state.selectedUser
    }));
  }
}));