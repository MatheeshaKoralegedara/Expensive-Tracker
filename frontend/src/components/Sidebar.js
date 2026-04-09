import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {

  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username");

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/goodbye");
  };

  return (
    <div className="w-72 h-screen bg-gray-900 text-white flex flex-col p-5">

      <h2 className="text-2xl font-bold mb-8 ">Expense Tracker</h2>

      <p className="mb-6 text-xl text-gray-300">
        Welcome, {username}
      </p>

      {/* Dashboard */}
      <button
        onClick={() => navigate("/dashboard")}
        className={`p-2 rounded-2xl text-left mb-4 ${
          isActive("/dashboard") ? "bg-blue-700" : "hover:bg-gray-700"
        }`}
      >
        📊 Dashboard
      </button>

      {/* Expenses */}
      <button
        onClick={() => navigate("/expenses")}
        className={`p-2 rounded-2xl text-left mb-4 ${
          isActive("/expenses") ? "bg-blue-700" : "hover:bg-gray-700"
        }`}
      >
        📋 Expenses
      </button>

      {/* Add */}
      <button
        onClick={() => navigate("/add")}
        className={`p-2 rounded-2xl text-left mb-4 ${
          isActive("/add") ? "bg-blue-700" : "hover:bg-gray-700"
        }`}
      >
        ➕ Add Expense
      </button>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 p-2 rounded-2xl hover:bg-red-600"
        >
          Logout 🚪
        </button>
      </div>

    </div>
  );
}

export default Sidebar;