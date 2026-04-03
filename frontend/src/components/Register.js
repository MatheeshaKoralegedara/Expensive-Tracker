import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();

        axios.post("http://localhost:8080/api/auth/register", {username, password})
            .then(() => {
                alert("Registration successful! Please login.");
                navigate("/");
            })
            .catch(err => console.error(err));
        };

        return (
            <div>
                <h2>Register</h2>
                <form onSubmit={handleRegister}>
                    <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                    <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button type="submit">Register</button>
                </form>
                <p>
                    Already have an account? <a href="/">Login here</a>
                </p>
            </div>
        );

}

export default Register;