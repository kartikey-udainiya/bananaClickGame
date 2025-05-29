import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <AlertTriangle className="h-16 w-16 text-warning-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow transition duration-200 mr-2"
        >
          Go Back
        </button>
        <button
          onClick={() => navigate('/')}
          className="py-2 px-4 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg shadow transition duration-200"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;