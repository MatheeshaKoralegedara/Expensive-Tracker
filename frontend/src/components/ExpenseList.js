import React, { use, useEffect, useState } from "react";
import axios from "axios";

function ExpenseList() {

    const [expenses, setExpenses] = useState([]);

    useEffect(()=> {
        fetchExpenses();
    },[]);

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
    
    return(
        <div>
            <h2>All Expenses</h2>
            <table border="1" cellPadding="5">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Amount</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Action</th>

                    </tr>
                </thead>
                <tbody>
                    {expenses.map(exp => (
                        <tr key={exp.id}>
                            <td>{exp.title}</td>
                            <td>Rs. {exp.amount}</td>
                            <td>{exp.category}</td>
                            <td>{new Date(exp.date).toLocaleDateString()}</td>
                            <td><button onClick={() => deleteExpense(exp.id)}>Delete</button></td>
                        </tr>
                    ))}
            </tbody>
            </table>

         
        </div>
    );     
}

export default ExpenseList;
