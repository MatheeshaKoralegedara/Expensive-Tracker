import React from "react";
import { Route, Routes } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import VerifyEmail from "./components/VerifyEmail";
import Welcome from "./components/Welcome";
import Goodbye from "./components/Goodbye";
import AppShell from "./components/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import ExpensesPage from "./pages/ExpensesPage";
import AddExpensePage from "./pages/AddExpensePage";
import SettingsPage from "./pages/SettingsPage";

function ProtectedAppPage({ children }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/goodbye" element={<Goodbye />} />
      <Route path="/dashboard" element={<ProtectedAppPage><DashboardPage /></ProtectedAppPage>} />
      <Route path="/expenses" element={<ProtectedAppPage><ExpensesPage /></ProtectedAppPage>} />
      <Route path="/add" element={<ProtectedAppPage><AddExpensePage /></ProtectedAppPage>} />
      <Route path="/settings" element={<ProtectedAppPage><SettingsPage /></ProtectedAppPage>} />
    </Routes>
  );
}

export default App;
