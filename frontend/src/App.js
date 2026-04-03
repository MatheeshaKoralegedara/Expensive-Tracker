import React from 'react';
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
    <div>
      <h1>Expense Tracker Dashboard</h1>
      <ExpenseForm onAdd={handleRefresh} selectedExpense={selectedExpense} />
      <ExpenseList key={refresh} onEdit={handleEdit} />
      <Dashboard/>
    </div>
  );
}

export default App;
