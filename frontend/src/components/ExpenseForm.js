import React, { useEffect, useState } from "react";
import axios from "axios";

function ExpenseForm({onAdd}) {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();

        const newExpense = {title, amount: parseFloat(amount), category, date};

        axios.post("http://localhost:8080/api/expenses", newExpense)
            .then(() =>{
              onAdd();
              setTitle("");
              setAmount("");
              setCategory("");
              setDate("");
    })
    .catch(err => console.error(err));
};

return (
    <div>
        <h2>Add Expense</h2>
        <form onSubmit={handleSubmit}>
            <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <input placeholder="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
            <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} required />
            <input placeholder="Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
            <button type="submit">Add Expense</button>
            </form>
            
    </div>
);
}

export default ExpenseForm;

    