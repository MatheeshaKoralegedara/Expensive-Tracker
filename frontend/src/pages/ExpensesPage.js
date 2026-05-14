
import React, { useState } from "react";
import ExpenseList from "../components/ExpenseList";
import ExpenseForm from "../components/ExpenseForm";

function ExpensesPage() {
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => setRefresh(prev => !prev);
  const handleCancel = () => setSelectedExpense(null);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Expenses</h1>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <div>
          <ExpenseList onEdit={setSelectedExpense} refresh={refresh} />
        </div>
        <div>
          {selectedExpense ? (
            <ExpenseForm
              selectedExpense={selectedExpense}
              onAdd={() => {
                handleRefresh();
                handleCancel();
              }}
              onCancel={handleCancel}
            />
          ) : (
            <div className="glass" style={{ padding:'32px 28px', maxWidth:520 }}>
              <h2 style={{ margin:0, fontSize:20, fontWeight:700 }}>Select an expense to edit</h2>
              <p style={{ marginTop:16, color:'var(--text-muted)', lineHeight:1.6 }}>
                Click the Edit button next to any expense to update its details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpensesPage;