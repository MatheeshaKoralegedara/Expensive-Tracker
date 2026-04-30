import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { path: "/dashboard", icon: "D", label: "Dashboard" },
  { path: "/expenses", icon: "E", label: "Expenses" },
  { path: "/add", icon: "+", label: "Add Expense" },
  { path: "/settings", icon: "S", label: "Settings" },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username") || "User";
  const initial = username.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/goodbye");
  };

  return (
    <aside className="sidebar">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36, paddingLeft: 4 }}>
        <div className="brand-mark">SW</div>
        <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18, color: "var(--text)" }}>
          SpendWise
        </span>
      </div>

      <div className="user-chip">
        <div className="avatar">{initial}</div>
        <div style={{ overflow: "hidden" }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {username}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>Workspace owner</p>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, paddingLeft: 4 }}>
          Menu
        </p>
        {navItems.map(({ path, icon, label }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`nav-item ${location.pathname === path ? "active" : ""}`}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      <button onClick={handleLogout} className="logout-button">
        <span className="nav-icon">X</span>
        Sign out
      </button>
    </aside>
  );
}

export default Sidebar;
