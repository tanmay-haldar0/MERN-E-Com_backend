import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the animation after the page loads
    setTimeout(() => {
      setIsVisible(true);
    }, 100); // Delay to make the animation smoother
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-white text-gray-800 px-4">
      <div className="text-center p-6 sm:p-10 rounded-lg shadow-md border border-gray-300 max-w-lg w-full mx-auto">
        {/* Animated 404 Text */}
        <h1
          className={`text-6xl sm:text-8xl font-extrabold text-gray-600 transition-all duration-700 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          404
        </h1>

        {/* Static Text */}
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mt-4 mb-2">
          Page Not Found
        </h2>
        <p className="text-base sm:text-lg text-gray-500 mb-6">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        {/* Link to Home */}
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 sm:px-8 sm:py-3 rounded-lg text-lg sm:text-xl font-medium transition duration-300 ease-in-out hover:bg-blue-500"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
