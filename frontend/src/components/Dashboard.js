import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Line } from "react-chartjs-2";
import {Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);


function Dashboard() {
    const [total, setTotal] = useState(0);
    const [categoryData, setCategoryData] = useState({});
    const [weeklyTrend, setWeeklyTrend] = useState({});

    useEffect(() => {
        axios.get("http://localhost:8080/api/expenses/total")
            .then(res => setTotal(res.data))
            
        axios.get("http://localhost:8080/api/expenses/category-summary")
            .then(res => setCategoryData(res.data));

        axios.get("http://localhost:8080/api/expenses/weekly-trend")
            .then(res => setWeeklyTrend(res.data));    
    },[]);

    const pieData = {
        labels: Object.keys(categoryData),
        datasets: [{
            data: Object.values(categoryData),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']    

        }]
    };

    const lineData = {
        labels:Object.keys(weeklyTrend),
        datasets: [{
            label: "Weekly Spending" ,
            data: Object.values(weeklyTrend),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };
    
    return (
        <div>
            <h2>Total Expenses: Rs. {total}</h2>
            <h3>Category Breakdown</h3>
            <Pie data={pieData} />

            <h3>Weekly Trend</h3>
            <Line data={lineData}/>

        </div>
    );
}

export default Dashboard;