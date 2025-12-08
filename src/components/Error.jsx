// pages/NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-9xl font-extrabold text-purple-500 mb-6">404</h1>
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        The page you are looking for doesn’t exist or has been moved.
        <br />
        Don’t worry, you can go back to the homepage and continue browsing.
      </p>
      <button onClick={() => navigate("/")} className="btn btn-primary btn-lg">
        Go Back Home
      </button>
    </div>
  );
};

export default Error;
