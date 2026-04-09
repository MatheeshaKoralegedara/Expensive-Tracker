import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        axios.post("http://localhost:8080/api/auth/login", {username, password})
            .then(res => {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("username", username);
                navigate("/welcome");
            })
            .catch(err => {
                alert("Login failed. Please check your credentials.");
                console.error(err);
            });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-300 to-red-300"> 
            <div className="bg-white p-6 rounded-3xl shadow-md mb-6 w-40">
                <h2 className="text-3xl font-bold mb-2 text-center ">Login</h2>
                </div>

            <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm bg-white p-6 rounded-3xl shadow-md">
                <input className="w-full p-2 border rounded-2xl focus:ring-2 focus:ring-blue-500" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                <input className="w-full p-2 border rounded-2xl focus:ring-2 focus:ring-blue-500" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-2xl hover:bg-blue-600">Login</button>
            </form> 

            <p className="text-sm text-center mt-4 text-white">
                Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register here</a>
            </p>
        </div>
    );

}

export default Login;