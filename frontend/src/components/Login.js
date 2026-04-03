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
                navigate("/dashboard");
            })
            .catch(err => {
                alert("Login failed. Please check your credentials.");
                console.error(err);
            });
    };

    return (
        <div> 
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
                <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form> 

            <p>
                Don't have an account? <a href="/register">Register here</a>
            </p>
        </div>
    );

}

export default Login;