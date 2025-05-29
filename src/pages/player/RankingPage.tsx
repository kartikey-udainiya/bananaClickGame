import React, { useEffect } from 'react';
import { Trophy, Banana, User, Award } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useAuthStore } from '../../store/authStore';
import PlayerLayout from '../../components/layout/PlayerLayout';

const RankingPage: React.FC = () => {
  const { rankings, fetchRankings, isLoading } = useGameStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchRankings();
    // Set up interval to refresh rankings every 10 seconds
    const interval = setInterval(() => {
      fetchRankings();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Get current user's rank
  const currentUserRank = rankings.findIndex(player => player.id === user?.id) + 1;

  return (
    <PlayerLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-primary-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="h-6 w-6" />
                Banana Clicker Rankings
              </h2>
              {currentUserRank > 0 && (
                <div className="bg-white text-primary-700 py-2 px-4 rounded-full font-bold flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Your Rank: #{currentUserRank}
                </div>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="p-10 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              {/* Top 3 Players */}
              {rankings.length > 0 && (
                <div className="flex flex-col md:flex-row justify-around items-center py-8 px-4 bg-primary-50">
                  {/* 2nd Place */}
                  {rankings.length > 1 && (
                    <div className="flex flex-col items-center mb-6 md:mb-0 md:order-1">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center mb-2 border-4 border-gray-300">
                        <User className="w-10 h-10 text-gray-700" />
                      </div>
                      <div className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full font-bold text-sm mb-1">
                        2nd Place
                      </div>
                      <h3 className="font-bold text-lg">{rankings[1].username}</h3>
                      <div className="flex items-center gap-1 text-primary-700">
                        <Banana className="w-4 h-4" />
                        <span className="font-semibold">{rankings[1].clickCount}</span>
                      </div>
                      {rankings[1].isOnline && (
                        <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 py-0.5 px-2 rounded-full">
                          Online
                        </span>
                      )}
                    </div>
                  )}

                  {/* 1st Place */}
                  <div className="flex flex-col items-center mb-6 md:mb-0 md:order-2">
                    <div className="relative">
                      <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                      </div>
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center mb-2 border-4 border-yellow-400 mt-3">
                        <User className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <div className="bg-yellow-400 text-yellow-800 py-1 px-4 rounded-full font-bold text-sm mb-1">
                      1st Place
                    </div>
                    <h3 className="font-bold text-xl">{rankings[0].username}</h3>
                    <div className="flex items-center gap-1 text-primary-700">
                      <Banana className="w-5 h-5" />
                      <span className="font-semibold text-lg">{rankings[0].clickCount}</span>
                    </div>
                    {rankings[0].isOnline && (
                      <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 py-0.5 px-2 rounded-full">
                        Online
                      </span>
                    )}
                  </div>

                  {/* 3rd Place */}
                  {rankings.length > 2 && (
                    <div className="flex flex-col items-center md:order-3">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center mb-2 border-4 border-amber-600">
                        <User className="w-10 h-10 text-white" />
                      </div>
                      <div className="bg-amber-500 text-amber-900 py-1 px-3 rounded-full font-bold text-sm mb-1">
                        3rd Place
                      </div>
                      <h3 className="font-bold text-lg">{rankings[2].username}</h3>
                      <div className="flex items-center gap-1 text-primary-700">
                        <Banana className="w-4 h-4" />
                        <span className="font-semibold">{rankings[2].clickCount}</span>
                      </div>
                      {rankings[2].isOnline && (
                        <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 py-0.5 px-2 rounded-full">
                          Online
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Full Rankings Table */}
              <div className="p-4">
                <h3 className="text-xl font-bold mb-4">All Players</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rank
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Player
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Banana Count
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {rankings.map((player, index) => (
                        <tr 
                          key={player.id} 
                          className={player.id === user?.id ? 'bg-primary-50' : ''}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {index + 1}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="h-6 w-6 text-gray-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {player.username}
                                  {player.id === user?.id && (
                                    <span className="ml-2 text-xs bg-primary-100 text-primary-800 py-0.5 px-2 rounded-full">
                                      You
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Banana className="h-5 w-5 text-primary-500" />
                              <span className="text-sm text-gray-900 font-medium">{player.clickCount}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              player.isOnline 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {player.isOnline ? 'Online' : 'Offline'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      
                      {rankings.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                            No players found. Be the first one to start clicking!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </PlayerLayout>
  );
};

export default RankingPage;