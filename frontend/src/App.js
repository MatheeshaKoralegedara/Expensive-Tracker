import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';

function App() {
  const [refresh, setRefresh] = React.useState(false);
  const [selectedExpense, setSelectedExpense] = React.useState(null);
  const handleEdit = (expense) => {
    setSelectedExpense(expense);
  };

  const handleRefresh = () => setRefresh(!refresh);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <div>
            <h1>Expense Tracker Dashboard</h1>
            <ExpenseForm onAdd={handleRefresh} selectedExpense={selectedExpense} />
            <ExpenseList key={refresh} onEdit={handleEdit} />
            <Dashboard/>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
