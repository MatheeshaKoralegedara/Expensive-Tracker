import React from "react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">
        <main className="app-main">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default AppShell;
