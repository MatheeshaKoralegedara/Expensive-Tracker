import React from 'react';
import { Route, Routes } from "react-router-dom";

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import Welcome from './components/Welcome'; 

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

      <Route path="/dashboard" element={
        <div className="min-h-screen bg-gray-100 p-6">

          <h1 className="text-3xl font-bold mb-6 text-center">
            Expense Tracker Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <ExpenseForm onAdd={handleRefresh} selectedExpense={selectedExpense} />
            <Dashboard />
          </div>

          <div className="mt-6">
            <ExpenseList key={refresh} onEdit={handleEdit} />
          </div>

        </div>
      } />

    </Routes>
  );
}

export default App;
