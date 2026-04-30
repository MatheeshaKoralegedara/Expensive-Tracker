import React from "react";
import Sidebar from "./Sidebar";

function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        {children}
      </main>
    </div>
  );
}

export default AppShell;
