import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../config/constants';

interface Player {
  id: string;
  username: string;
  clickCount: number;
  isOnline: boolean;
  isBlocked: boolean;
}

interface GameState {
  clickCount: number;
  rankings: Player[];
  isLoading: boolean;
  error: string | null;
  incrementClickCount: () => Promise<void>;
  fetchRankings: () => Promise<void>;
  updatePlayerClickCount: (playerId: string, newCount: number) => void;
  updatePlayerStatus: (playerId: string, isOnline: boolean) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  clickCount: 0,
  rankings: [],
  isLoading: false,
  error: null,
  
  incrementClickCount: async () => {
    try {
      // Optimistically update UI
      set(state => ({ clickCount: state.clickCount + 1 }));
      
      // Send update to server
      await axios.post(`${API_URL}/game/click`);
    } catch (err) {
      // Revert the optimistic update on error
      set(state => ({ 
        clickCount: state.clickCount - 1,
        error: 'Failed to update click count'
      }));
    }
  },
  
  fetchRankings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/game/rankings`);
      set({ 
        rankings: response.data.rankings,
        isLoading: false
      });
    } catch (err) {
      set({ 
        isLoading: false,
        error: 'Failed to fetch rankings'
      });
    }
  },
  
  updatePlayerClickCount: (playerId: string, newCount: number) => {
    set(state => ({
      rankings: state.rankings.map(player => 
        player.id === playerId 
          ? { ...player, clickCount: newCount }
          : player
      ).sort((a, b) => b.clickCount - a.clickCount)
    }));
  },
  
  updatePlayerStatus: (playerId: string, isOnline: boolean) => {
    set(state => ({
      rankings: state.rankings.map(player => 
        player.id === playerId 
          ? { ...player, isOnline }
          : player
      )
    }));
  }
}));