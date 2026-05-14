import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import spendwiseLogo from "../assets/spendwise-logo.png";
import Footer from "./Footer";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    setError("");

    api.post("/auth/login", { username, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user.id);
        localStorage.setItem("username", res.data.user.username);
        localStorage.setItem("email", res.data.user.email);
        localStorage.setItem("firstName", res.data.user.firstName);
        localStorage.setItem("lastName", res.data.user.lastName);
        navigate("/welcome");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Invalid username or password. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      padding: 24,
    }}>
      <div className="fade-up" style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img className="auth-logo" src={spendwiseLogo} alt="SpendWise logo" />
          
          <p style={{ color: "var(--text-muted)", marginTop: 1, fontSize: 14 }}>Track every rupee, own your future</p>
        </div>

        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: "36px 32px",
        }}>
          <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 700 }}>Sign in</h2>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label className="field-label" style={{ display: "block", marginBottom: 6 }}>Username</label>
              <input
                className="input-field"
                placeholder="Enter your username"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setError("");
                }}
                required
              />
            </div>
            <div>
              <label className="field-label" style={{ display: "block", marginBottom: 6 }}>Password</label>
              <input
                className="input-field"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                required
              />
            </div>

            {error && (
              <div style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.25)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "var(--red)" }}>
                {error}
              </div>
            )}

            <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 8, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "var(--text-muted)" }}>
            New here?{" "}
            <Link to="/register" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Create an account</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
