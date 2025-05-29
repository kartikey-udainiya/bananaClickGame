import React, { useEffect, useState } from 'react';
import { PlusCircle, Search, UserX, Edit, Trash2, Ban, CheckCircle, Users, AlertCircle } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import AdminLayout from '../../components/layout/AdminLayout';
import UserModal from './components/UserModal';

const AdminDashboard: React.FC = () => {
  const { users, fetchUsers, deleteUser, updateUser, setSelectedUser, selectedUser } = useAdminStore();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirmDelete === userId) {
      setIsLoading(true);
      try {
        await deleteUser(userId);
        setConfirmDelete(null);
      } catch (err) {
        console.error('Failed to delete user:', err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setConfirmDelete(userId);
      // Auto-reset after 3 seconds
      setTimeout(() => {
        setConfirmDelete(null);
      }, 3000);
    }
  };

  const handleToggleBlock = async (user: any) => {
    setIsLoading(true);
    try {
      await updateUser(user.id, { isBlocked: !user.isBlocked });
    } catch (err) {
      console.error('Failed to update user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Count online players
  const onlineCount = users.filter(user => user.isOnline && user.role === 'player').length;
  const totalPlayers = users.filter(user => user.role === 'player').length;
  const blockedCount = users.filter(user => user.isBlocked).length;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
        <p className="text-gray-600">Manage players and monitor their activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <Users className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Online Players</h3>
              <p className="text-3xl font-bold text-primary-600">{onlineCount} <span className="text-sm text-gray-500 font-normal">/ {totalPlayers}</span></p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="bg-error-100 p-3 rounded-full">
              <Ban className="h-8 w-8 text-error-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Blocked Users</h3>
              <p className="text-3xl font-bold text-error-600">{blockedCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="bg-secondary-100 p-3 rounded-full">
              <Users className="h-8 w-8 text-secondary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total Players</h3>
              <p className="text-3xl font-bold text-secondary-600">{totalPlayers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">User List</h2>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 w-full"
              />
            </div>
            
            <button
              onClick={handleCreateUser}
              className="flex items-center gap-2 bg-secondary-600 hover:bg-secondary-700 text-white py-2 px-4 rounded-lg transition duration-200"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Add User</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Banana Count
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className={user.isBlocked ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          <div className="text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.clickCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isBlocked 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                        {!user.isBlocked && (
                          <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isOnline 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.isOnline ? 'Online' : 'Offline'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Edit User"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleToggleBlock(user)}
                          className={`p-1 ${user.isBlocked ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'}`}
                          title={user.isBlocked ? 'Unblock User' : 'Block User'}
                        >
                          {user.isBlocked ? <CheckCircle className="h-5 w-5" /> : <Ban className="h-5 w-5" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className={`p-1 ${confirmDelete === user.id ? 'text-red-700 bg-red-100 rounded' : 'text-red-600 hover:text-red-900'}`}
                          title="Delete User"
                        >
                          {confirmDelete === user.id ? <AlertCircle className="h-5 w-5" /> : <Trash2 className="h-5 w-5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    {searchTerm ? 'No users found matching your search.' : 'No users found. Add a new user to get started.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal */}
      {showModal && (
        <UserModal
          mode={modalMode}
          onClose={() => setShowModal(false)}
          user={selectedUser}
        />
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;