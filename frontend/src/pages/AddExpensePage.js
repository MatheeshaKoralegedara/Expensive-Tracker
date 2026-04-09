import React, { useState } from "react";
import ExpenseForm from "../components/ExpenseForm";

function AddExpensePage() {

  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => setRefresh(!refresh);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add Expense</h1>

      <ExpenseForm onAdd={handleRefresh} />
    </div>
  );
}

export default AddExpensePage;