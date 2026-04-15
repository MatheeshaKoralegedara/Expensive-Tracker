import React from 'react';
import { Route, Routes } from "react-router-dom";

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import Welcome from './components/Welcome'; 
import Sidebar from './components/Sidebar';
import DashboardPage from "./pages/DashboardPage";
import ExpensesPage from "./pages/ExpensesPage";
import AddExpensePage from "./pages/AddExpensePage";
import Goodbye from './components/Goodbye';


function App() {

  const [refresh, setRefresh] = React.useState(false);
  const [selectedExpense, setSelectedExpense] = React.useState(null);

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
  };

  const handleRefresh = () => setRefresh(!refresh);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/goodbye" element={<Goodbye />} />

  
<Route path="/dashboard" element={
  <div className="flex">
    <Sidebar />
    <div className="flex-1 p-6 bg-gray-100">
      <DashboardPage />
    </div>
  </div>
} />

<Route path="/expenses" element={
  <div className="flex">
    <Sidebar />
    <div className="flex-1 p-6 bg-gray-100">
      <ExpensesPage />
    </div>
  </div>
} />

<Route path="/add" element={
  <div className="flex">
    <Sidebar />
    <div className="flex-1 p-6 bg-gray-100">
      <AddExpensePage />
    </div>
  </div>
} />



    </Routes>
  );
}

export default App;
