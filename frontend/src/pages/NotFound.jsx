import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-fuchsia-900 to-black flex items-center justify-center px-4">
      <div className="text-center">
        <div className="bg-black/50 backdrop-blur-md rounded-2xl shadow-2xl p-12 border border-pink-500/30">
          <h1 className="text-8xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-fuchsia-500 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-3xl font-semibold text-white mb-4">Page Not Found</h2>
          <p className="text-pink-300 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
          <Link
            to="/"
            className="bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 inline-block"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
