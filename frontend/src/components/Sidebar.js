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
    <div className="w-64 bg-gray-900 text-white flex flex-col p-6 shadow-xl">
  <h2 className="text-3xl font-bold mb-10 tracking-wide">Expense Tracker</h2>
  <p className="mb-8 text-lg text-gray-300">Welcome, {username}</p>

  {/* Navigation */}
  <button
    onClick={() => navigate("/dashboard")}
    className={`flex items-center p-3 mb-3 rounded-lg ${
      isActive("/dashboard") ? "bg-blue-600" : "hover:bg-gray-700"
    } transition-all duration-300`}
  >
    📊 <span className="ml-2 font-semibold">Dashboard</span>
  </button>

  <button
    onClick={() => navigate("/expenses")}
    className={`flex items-center p-3 mb-3 rounded-lg ${
      isActive("/expenses") ? "bg-blue-600" : "hover:bg-gray-700"
    } transition-all duration-300`}
  >
    📋 <span className="ml-2 font-semibold">Expenses</span>
  </button>

  <button
    onClick={() => navigate("/add")}
    className={`flex items-center p-3 mb-3 rounded-lg ${
      isActive("/add") ? "bg-blue-600" : "hover:bg-gray-700"
    } transition-all duration-300`}
  >
    ➕ <span className="ml-2 font-semibold">Add Expense</span>
  </button>

  <div className="mt-auto">
    <button
      onClick={handleLogout}
      className="w-full bg-red-500 p-3 rounded-lg hover:bg-red-600 transition-all duration-300"
    >
      Logout 🚪
    </button>
  </div>
</div>
  );
}

export default Sidebar;