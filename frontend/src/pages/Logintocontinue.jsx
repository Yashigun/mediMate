import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { miffy2 } from '../assets/assets';

const LoginToContinue = () => {
  const navigate = useNavigate();
  
  const handleLoginRedirect = () => {
    // Redirect to login page
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center">

        {/* Cute Icon */}
        <div className="inline-flex items-center justify-center w-50 h-50 rounded-full mb-8">
          <img src={miffy2} className="w-50 h-50 flex items-center justify-center"/>
        </div>

        {/* Message */}
        <h1 className="text-4xl font-bold text-primary mb-4">
          Login to Continue
        </h1>
        <p className="text-primary opacity-70 text-lg mb-8">
          Please sign in to access your account
        </p>

        {/* Login Button */}
        <button
          onClick={handleLoginRedirect}
          className="bg-primary text-white font-semibold py-4 px-8 rounded-2xl hover:shadow-lg focus:ring-primary focus:ring-opacity-30 transition-all duration-200 flex items-center justify-center group mx-auto"
        >
          Go to Login
          <span className="ml-3 group-hover:translate-x-1 transition-transform duration-200">→</span>
        </button>
      </div>
    </div>
  );
};

export default LoginToContinue;