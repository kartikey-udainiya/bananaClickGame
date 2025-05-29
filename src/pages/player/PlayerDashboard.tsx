import React, { useEffect, useState } from 'react';
import { Banana } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useAuthStore } from '../../store/authStore';
import { useSocket } from '../../context/SocketContext';
import PlayerLayout from '../../components/layout/PlayerLayout';

const PlayerDashboard: React.FC = () => {
  const { clickCount, incrementClickCount } = useGameStore();
  const { user } = useAuthStore();
  const { socket, isConnected } = useSocket();
  const [showAnimation, setShowAnimation] = useState(false);
  const [buttonScale, setButtonScale] = useState(1);

  useEffect(() => {
    // Fetch initial click count for the user
    if (user && isConnected) {
      socket?.emit('get_click_count', { userId: user.id });
    }
  }, [user, isConnected, socket]);

  // Listen for click count updates from server
  useEffect(() => {
    if (socket) {
      socket.on('click_count', (data) => {
        if (data.userId === user?.id) {
          useGameStore.setState({ clickCount: data.clickCount });
        }
      });

      return () => {
        socket.off('click_count');
      };
    }
  }, [socket, user]);

  const handleBananaClick = async () => {
    await incrementClickCount();
    
    // Create click animation
    setShowAnimation(true);
    setButtonScale(0.95);
    
    setTimeout(() => {
      setShowAnimation(false);
      setButtonScale(1);
    }, 300);
  };

  return (
    <PlayerLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {user?.username}!</h2>
          <p className="text-gray-600 mb-6">
            Click the banana as many times as you can to climb the leaderboard!
          </p>
          
          <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <Banana className="h-6 w-6 text-primary-500" />
              <span className="text-lg font-medium">Your Banana Count:</span>
            </div>
            <span className="text-3xl font-bold text-primary-700">{clickCount}</span>
          </div>
          
          <div className="relative flex flex-col items-center justify-center p-10">
            {showAnimation && (
              <div className="absolute pointer-events-none animate-ping opacity-70">
                <Banana className="h-24 w-24 text-primary-400" />
              </div>
            )}
            
            <button
              onClick={handleBananaClick}
              style={{ transform: `scale(${buttonScale})` }}
              className="relative bg-primary-500 hover:bg-primary-600 text-white p-10 rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-300"
            >
              <Banana className="h-24 w-24" />
              <span className="sr-only">Click the banana</span>
            </button>
            
            <span className="mt-6 text-xl font-medium">Click the Banana!</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">How to Play</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="inline-block bg-primary-100 text-primary-800 font-bold rounded-full h-6 w-6 flex items-center justify-center mt-0.5">1</span>
              <span>Click the banana button as many times as you can</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block bg-primary-100 text-primary-800 font-bold rounded-full h-6 w-6 flex items-center justify-center mt-0.5">2</span>
              <span>Each click increases your banana count by one</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block bg-primary-100 text-primary-800 font-bold rounded-full h-6 w-6 flex items-center justify-center mt-0.5">3</span>
              <span>Check the rankings page to see how you compare to other players</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block bg-primary-100 text-primary-800 font-bold rounded-full h-6 w-6 flex items-center justify-center mt-0.5">4</span>
              <span>The player with the most banana clicks wins!</span>
            </li>
          </ul>
        </div>
      </div>
    </PlayerLayout>
  );
};

export default PlayerDashboard;