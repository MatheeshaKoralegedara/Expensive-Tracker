import React, { useEffect, useState } from "react";
import axios from "axios";

function ExpenseList({ onEdit }) {

    const [expenses, setExpenses] = useState([]);
    const [category, setCategory] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = () => {
        axios.get("http://localhost:8080/api/expenses")
            .then(res => setExpenses(res.data))
            .catch(err => console.error(err));
    };

    const deleteExpense = (id) => {
        axios.delete(`http://localhost:8080/api/expenses/${id}`)
            .then(() => fetchExpenses())
            .catch(err => console.error(err));
    };

    const filterByCategory = () => {
        if (category === "") return fetchExpenses();

        axios.get(`http://localhost:8080/api/expenses/category/${category}`)
            .then(res => setExpenses(res.data))
            .catch(err => console.error(err));
    };

    const filterByDateRange = () => {
        if (!startDate || !endDate){
                alert("Please select both start and end dates");

       return ;
        }

        axios.get(`http://localhost:8080/api/expenses/filter?start=${startDate}&end=${endDate}`)
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
        <div>
            <h2>All Expenses</h2>

            <h3>Filters</h3>

            {/* Category */}
            <input
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            />
            <button onClick={filterByCategory}>Filter by Category</button>

            {/* Date */}
            <br /><br />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <button onClick={filterByDateRange}>Filter by Date</button>
            {expenses.length === 0 && <p>No expenses found for selected filters.</p>}

            {/* Reset */}
            <br /><br />
            <button onClick={resetFilters}>Reset</button>

            <table border="1" cellPadding="5">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Amount</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map(exp => (
                        <tr key={exp.id}>
                            <td>{exp.title}</td>
                            <td>Rs. {exp.amount}</td>
                            <td>{exp.category}</td>
                            <td>{exp.date}</td>
                            <td>
                                <button onClick={() => onEdit(exp)}>Edit</button>
                                <button onClick={() => deleteExpense(exp.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ExpenseList;