import React, { useEffect, useState } from "react";
import axios from "axios";

function ExpenseForm({onAdd, selectedExpense}) {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();

        const expenseData = {title, amount: parseFloat(amount), category, date};

        if(selectedExpense){
            // UPDATE
            axios.put(`http://localhost:8080/api/expenses/${selectedExpense.id}`, expenseData)
                .then(() => {
                    onAdd();
                    setTitle("");
                    setAmount("");
                    setCategory("");
                    setDate("");
                })
                .catch(err => console.error(err));
        } else {
            //ADD
            axios.post("http://localhost:8080/api/expenses", expenseData)
                .then(() => {
                    onAdd();
                    setTitle("");
                    setAmount("");
                    setCategory("");
                    setDate("");
                })
                .catch(err => console.error(err));
        }
    };

    useEffect(() => {
        if(selectedExpense){
            setTitle(selectedExpense.title);
            setAmount(selectedExpense.amount);
            setCategory(selectedExpense.category);
            setDate(selectedExpense.date.split("T")[0]);
        }
    }, [selectedExpense]);

    return (
        <div>
            <h2>Add Expense</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                <input placeholder="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
                <select onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    <option value="Food">Food</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Bills">Bills</option>
                    <option value="Other">Other</option>

                </select>
                <input placeholder="Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                <button type="submit">Add Expense</button>
            </form>
        </div>
    );
}

export default ExpenseForm;

    