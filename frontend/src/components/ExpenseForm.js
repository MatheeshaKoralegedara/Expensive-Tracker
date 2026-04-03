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
        <div className="bg-white p-6 rounded-3xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input className="w-full p-2 border rounded-2xl" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                <input  className="w-full p-2 border rounded-2xl"placeholder="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
                <select  className="w-full p-2 border rounded-2xl"onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    <option value="Food">Food</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Bills">Bills</option>
                    <option value="Other">Other</option>

                </select>
                <input className="w-full p-2 border rounded-2xl" placeholder="Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                <button className="w-full bg-blue-400 text-white p-2 rounded-2xl hover:bg-blue-600" type="submit">Save</button>
            </form>
        </div>
    );
}

export default ExpenseForm;

    