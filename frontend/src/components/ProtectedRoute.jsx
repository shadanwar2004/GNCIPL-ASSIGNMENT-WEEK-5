import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-fuchsia-900 to-black flex items-center justify-center">
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-pink-500/20">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-pink-400/30 border-t-pink-400 rounded-full animate-spin mr-3"></div>
            <span className="text-white text-lg">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
