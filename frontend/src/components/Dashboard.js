import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../api";
import { Pie, Line } from "react-chartjs-2";
import {Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement} from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);


function Dashboard() {
    const [total, setTotal] = useState(0);
    const [categoryData, setCategoryData] = useState({});
    const [weeklyTrend, setWeeklyTrend] = useState({});

    useEffect(() => {
        api.get("/expenses/total")
            .then(res => setTotal(res.data))
            .catch(err => console.error("Error fetching total:", err));
            
        api.get("/expenses/category-summary")
            .then(res => setCategoryData(res.data))
            .catch(err => console.error("Error fetching categories:", err));

        api.get("/expenses/weekly-trend")
            .then(res => setWeeklyTrend(res.data))
            .catch(err => console.error("Error fetching trends:", err));    
    },[]);

    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
        }   
    }, []);

    const logout = () => { 
        localStorage.removeItem("token");
        window.location.href = "/";
    }; 

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
        <div className="bg-gray-100 p-6 rounded-3xl shadow-md">
            <button className="w-full bg-red-500 text-white p-2 rounded-2xl hover:bg-yellow-500" onClick={logout}>Logout</button>
            <h2 className="text-3xl font-semibold mb-4">Total Expenses </h2>
            <p className="text-2xl font-bold mb-6">Rs.{total.toFixed(2)}</p>
            
            <div className="bg-white p-6 rounded-2xl shadow-md mt-4">
            <h3 className="font-semibold mb-2">Category Breakdown</h3>
            <Pie data={pieData} />

            <h3 className="font-semibold mb-2">Weekly Trend</h3>
            <Line data={lineData}/>
            </div>
        </div>
    );
}

export default Dashboard;