import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Welcome() {

  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const username = localStorage.getItem("username");

  useEffect(() => {
    let value = 0;

    const interval = setInterval(() => {
      value += 5;
      setProgress(value);

      if (value >= 100) {
        clearInterval(interval);
        navigate("/dashboard");
      }
    }, 150); // speed control

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">

      <h1 className="text-4xl font-bold text-white">
        Welcome {username} 👋
      </h1>

      <p className="text-white mt-4">
        Loading your dashboard...
      </p>

      {/* Progress Bar */}
      <div className="w-64 h-3 bg-gray-300 rounded-full mt-6 overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Percentage */}
      <p className="text-white mt-2">{progress}%</p>

    </div>
  );
}

export default Welcome;