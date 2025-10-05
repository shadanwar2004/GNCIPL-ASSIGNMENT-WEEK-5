import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-16">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
            Task Manager
          </h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-purple-300">
            Organize your life with our sleek and intuitive task management application.
            Stay productive and never miss a deadline again.
          </p>

          {/* Auth Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-8 rounded-xl text-lg shadow-md transition-all duration-300 transform hover:scale-105"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-8 rounded-xl text-lg shadow-md transition-all duration-300 transform hover:scale-105"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="bg-gray-800 border border-purple-700 text-purple-300 hover:text-white hover:border-pink-500 font-semibold py-4 px-8 rounded-xl text-lg shadow transition-all duration-300"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Easy Task Creation",
              text: "Quickly add new tasks with a simple and intuitive interface. Stay organized and focused on what matters most.",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              )
            },
            {
              title: "Real-time Editing",
              text: "Edit your tasks in real-time with instant updates. Make changes on the fly without missing a beat.",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              )
            },
            {
              title: "Secure & Private",
              text: "Your tasks are securely stored and accessible only to you. Privacy and security are our top priorities.",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              )
            }
          ].map((feature, i) => (
            <div
              key={i}
              className="rounded-2xl p-8 border shadow-md text-center hover:shadow-xl transition-all duration-300 bg-gray-800 border-purple-700 text-purple-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {feature.icon}
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
              <p className="text-purple-200">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
