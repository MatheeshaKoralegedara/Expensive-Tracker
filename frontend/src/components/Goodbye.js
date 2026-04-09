import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Goodbye() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/"); // Redirect to login after 2s
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-red-500">
      <h1 className="text-4xl font-bold text-white animate-pulse">
        👋 See you next time!
      </h1>
    </div>
  );
}

export default Goodbye;