import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
    const [total, setTotal] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:8080/api/expenses/total")
            .then(res => setTotal(res.data))
            .catch(err => console.error(err));
    },[]);

    return (
        <div>
            <h2>Total Expenses: Rs. {total}</h2>
        </div>
    );
}

export default Dashboard;