import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "../api";
import { Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler } from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

const COLORS = ["#6c63ff", "#ff6b6b", "#43e97b", "#ffd93d", "#4facfe", "#f77f00"];

function formatCurrency(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function StatCard({ label, value, helper, tone = "accent", delay = 0 }) {
  return (
    <div className="stat-card fade-up" style={{ animationDelay: `${delay}ms` }}>
      <p className="metric-label">{label}</p>
      <p className={`metric-value metric-${tone}`}>{value}</p>
      {helper && <p className="metric-helper">{helper}</p>}
    </div>
  );
}

function Dashboard() {
  const [total, setTotal] = useState(0);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [categoryData, setCategoryData] = useState({});
  const [weeklyTrend, setWeeklyTrend] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAll = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    setLoading(true);
    Promise.all([
      api.get("/expenses/total"),
      api.get("/expenses/weekly-summary"),
      api.get("/expenses/category-summary"),
      api.get("/expenses/weekly-trend"),
      api.get("/expenses"),
      api.get("/users/me"),
    ])
      .then(([totalRes, weeklyRes, catRes, weekRes, expensesRes, profileRes]) => {
        setTotal(totalRes.data);
        setWeeklyTotal(weeklyRes.data);
        setCategoryData(catRes.data || {});
        setWeeklyTrend(weekRes.data || {});
        setExpenses(expensesRes.data || []);
        setProfile(profileRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const insights = useMemo(() => {
    const topCategory = Object.entries(categoryData).sort((a, b) => b[1] - a[1])[0];
    const budget = Number(profile?.weeklyBudget || 0);
    const remaining = Math.max(budget - Number(weeklyTotal || 0), 0);
    const budgetUsed = budget > 0 ? Math.min((Number(weeklyTotal || 0) / budget) * 100, 100) : 0;
    const average = expenses.length > 0 ? Number(total || 0) / expenses.length : 0;
    const recent = [...expenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    return { topCategory, budget, remaining, budgetUsed, average, recent };
  }, [categoryData, expenses, profile, total, weeklyTotal]);

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [{ data: Object.values(categoryData), backgroundColor: COLORS, borderColor: "transparent", hoverOffset: 6 }],
  };

  const lineData = {
    labels: Object.keys(weeklyTrend),
    datasets: [{
      label: "Daily spend",
      data: Object.values(weeklyTrend),
      fill: true,
      borderColor: "#6c63ff",
      backgroundColor: "rgba(108,99,255,0.08)",
      tension: 0.4,
      pointBackgroundColor: "#6c63ff",
      pointRadius: 4,
      pointHoverRadius: 6,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#8f8fa6", font: { family: "DM Sans" } } },
      tooltip: { backgroundColor: "#1c1c28", borderColor: "rgba(255,255,255,0.07)", borderWidth: 1, titleColor: "#e8e8f0", bodyColor: "#c9c9d6" },
    },
    scales: {
      x: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#8f8fa6" } },
      y: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#8f8fa6" } },
    },
  };

  if (loading) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 24 }}>
        {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 140 }} />)}
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <p className="eyebrow">Finance workspace</p>
          <h1>Command center</h1>
        </div>
        <button className="secondary-action" onClick={() => navigate("/add")}>Add expense</button>
      </div>

      <div className="dashboard-grid">
        <StatCard label="Total spend" value={formatCurrency(total)} helper={`${expenses.length} tracked transactions`} delay={0} />
        <StatCard label="This week" value={formatCurrency(weeklyTotal)} helper={insights.budget > 0 ? `${Math.round(insights.budgetUsed)}% of budget used` : "Set a weekly budget in Settings"} tone="blue" delay={80} />
        <StatCard label="Average transaction" value={formatCurrency(insights.average)} helper={insights.topCategory ? `Top category: ${insights.topCategory[0]}` : "No category data yet"} tone="green" delay={160} />
      </div>

      <div className="budget-panel">
        <div>
          <p className="metric-label">Weekly budget health</p>
          <h2 style={{ margin: "8px 0 8px", fontSize: 28 }}>
            {insights.budget > 0 ? formatCurrency(insights.remaining) : "No budget set"}
          </h2>
          <p style={{ margin: 0, color: "var(--text-muted)" }}>
            {insights.budget > 0 ? `Remaining from ${formatCurrency(insights.budget)} this week.` : "Create a spending guardrail from Settings to unlock budget tracking."}
          </p>
        </div>
        <div className="budget-meter" aria-label="Weekly budget usage">
          <div style={{ width: `${insights.budgetUsed}%` }} />
        </div>
      </div>

      <div className="analytics-grid">
        <section className="glass analytics-card">
          <h3>Category mix</h3>
          {Object.keys(categoryData).length > 0 ? (
            <div style={{ height: 240 }}>
              <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { color: "#8f8fa6", padding: 12, font: { family: "DM Sans", size: 12 } } }, tooltip: chartOptions.plugins.tooltip } }} />
            </div>
          ) : (
            <p className="empty-state">No category data yet</p>
          )}
        </section>

        <section className="glass analytics-card">
          <h3>7-day trend</h3>
          {Object.keys(weeklyTrend).length > 0 ? (
            <div style={{ height: 240 }}>
              <Line data={lineData} options={chartOptions} />
            </div>
          ) : (
            <p className="empty-state">No weekly data yet</p>
          )}
        </section>
      </div>

      <section className="glass recent-panel">
        <div className="section-title-row">
          <h3>Recent activity</h3>
          <button className="text-action" onClick={() => navigate("/expenses")}>View all</button>
        </div>
        {insights.recent.length === 0 ? (
          <p className="empty-state">No expenses recorded yet</p>
        ) : (
          <div className="recent-list">
            {insights.recent.map((expense) => (
              <div className="recent-row" key={expense.id}>
                <div>
                  <strong>{expense.title}</strong>
                  <span>{expense.category} / {expense.date}</span>
                </div>
                <strong>{formatCurrency(expense.amount)}</strong>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
