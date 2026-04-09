
import React, { useState } from "react";
import ExpenseList from "../components/ExpenseList";

function ExpensesPage() {

  const [selectedExpense, setSelectedExpense] = useState(null);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Expenses</h1>

      <ExpenseList onEdit={setSelectedExpense} />
    </div>
  );
}

export default ExpensesPage;