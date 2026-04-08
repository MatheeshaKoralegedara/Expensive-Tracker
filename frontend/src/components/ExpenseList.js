import React, { useEffect, useState } from "react";
import api from "../api";

function ExpenseList({ onEdit }) {

    const [expenses, setExpenses] = useState([]);
    const [category, setCategory] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = () => {
        api.get("/expenses")
            .then(res => setExpenses(res.data))
            .catch(err => console.error(err));
    };

    const deleteExpense = (id) => {
        api.delete(`/expenses/${id}`)
            .then(() => fetchExpenses())
            .catch(err => console.error(err));
    };

    const filterByCategory = () => {
        if (category === "") return fetchExpenses();

        api.get(`/expenses/category/${category}`)
            .then(res => setExpenses(res.data))
            .catch(err => console.error(err));
    };

    const filterByDateRange = () => {
        if (!startDate || !endDate){
                alert("Please select both start and end dates");

       return ;
        }

        api.get(`/expenses/filter?start=${startDate}&end=${endDate}`)
            .then(res => {
                console.log("Filtered Date: ", res.date);
                setExpenses(res.data);
            })
            .catch(err => console.error(err));

            };

    const resetFilters = () => {
        setCategory("");
        setStartDate("");
        setEndDate("");
        fetchExpenses();
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">All Expenses</h2>

            <h3 className="font-semibold mb-2">Filters</h3>

            {/* Category */}
            <input className="w-full p-2 border rounded-2xl mb-4"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            />
            <button className="w-full bg-blue-400 text-white p-2 rounded-2xl hover:bg-blue-600 " onClick={filterByCategory}>Filter by Category</button>

            {/* Date */}
            <br /><br />
            <input className="w-full p-2 border rounded-2xl mb-4" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input  className="w-full p-2 border rounded-2xl mb-4" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <button className="w-full bg-blue-400 text-white p-2 rounded-2xl hover:bg-blue-600" onClick={filterByDateRange}>Filter by Date</button>
            {expenses.length === 0 && <p>No expenses found for selected filters.</p>}

            {/* Reset */}
            <br /><br />
            <button className="w-full bg-gray-400 text-white p-2 rounded-2xl hover:bg-gray-600 mb-6" onClick={resetFilters}>Reset</button>

            <table className="w-full border-collapse" border="1" cellPadding="5">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2">Title</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map(exp => (
                        <tr key={exp.id} className="border-t text-center">
                            <td className="p-2">{exp.title}</td>
                            <td className="p-2 text-green-500">Rs. {exp.amount}</td>
                            <td className="p-2">{exp.category}</td>
                            <td className="p-2">{exp.date}</td>
                            <td className="p-2 space-x-2">
                                <button className="bg-blue-400 text-white p-2 rounded-2xl hover:bg-blue-600" onClick={() => onEdit(exp)}>Edit</button>
                                <button className="bg-red-400 text-white p-2 rounded-2xl hover:bg-red-600" onClick={() => deleteExpense(exp.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
        </div>
    );
}

export default ExpenseList;