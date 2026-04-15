
import React, { useEffect, useState, useCallback } from 'react';
import api from '../api';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

const COLORS = ['#6c63ff','#ff6b6b','#43e97b','#ffd93d','#4facfe','#f77f00'];

function StatCard({ label, value, icon, color, delay=0 }) {
  return (
    <div className="stat-card fade-up" style={{ animationDelay:`${delay}ms` }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
        <p style={{ margin:0, fontSize:12, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em' }}>{label}</p>
        <div style={{ width:36, height:36, borderRadius:10, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{icon}</div>
      </div>
      <p style={{ margin:0, fontSize:28, fontWeight:800, color:'var(--text)', fontFamily:'Syne, sans-serif' }}>{value}</p>
    </div>
  );
}

function Dashboard() {
  const [total, setTotal] = useState(0);
  const [categoryData, setCategoryData] = useState({});
  const [weeklyTrend, setWeeklyTrend] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAll = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }
    setLoading(true);
    Promise.all([
      api.get('/expenses/total'),
      api.get('/expenses/category-summary'),
      api.get('/expenses/weekly-trend')
    ]).then(([totalRes, catRes, weekRes]) => {
      setTotal(totalRes.data);
      setCategoryData(catRes.data);
      setWeeklyTrend(weekRes.data);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const topCategory = Object.entries(categoryData).sort((a,b) => b[1]-a[1])[0];
  const expenseCount = Object.values(categoryData).reduce((a,b) => a+b, 0);

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [{ data: Object.values(categoryData), backgroundColor: COLORS, borderColor: 'transparent', hoverOffset: 6 }]
  };

  const lineData = {
    labels: Object.keys(weeklyTrend),
    datasets: [{
      label: 'Weekly Spending',
      data: Object.values(weeklyTrend),
      fill: true,
      borderColor: '#6c63ff',
      backgroundColor: 'rgba(108,99,255,0.08)',
      tension: 0.4,
      pointBackgroundColor: '#6c63ff',
      pointRadius: 5,
      pointHoverRadius: 7,
    }]
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#6b6b80', font: { family:'DM Sans' } } }, tooltip: { backgroundColor:'#1c1c28', borderColor:'rgba(255,255,255,0.07)', borderWidth:1, titleColor:'#e8e8f0', bodyColor:'#6b6b80' } },
    scales: { x: { grid:{ color:'rgba(255,255,255,0.04)' }, ticks:{ color:'#6b6b80' } }, y: { grid:{ color:'rgba(255,255,255,0.04)' }, ticks:{ color:'#6b6b80' } } }
  };

  if (loading) return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, marginTop:24 }}>
      {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:120 }} />)}
    </div>
  );

  return (
    <div className="fade-in">
      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:20, marginBottom:28 }}>
        <StatCard label="Total Spent" value={`Rs. ${Number(total).toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}`} icon="💸" color="#6c63ff" delay={0} />
        <StatCard label="Top Category" value={topCategory ? topCategory[0] : '—'} icon="🏆" color="#ffd93d" delay={80} />
        <StatCard label="Transactions" value={expenseCount} icon="📋" color="#43e97b" delay={160} />
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:20 }}>
        {/* Pie */}
        <div className="glass fade-up" style={{ padding:28, animationDelay:'200ms' }}>
          <h3 style={{ margin:'0 0 20px', fontSize:16, fontWeight:700 }}>By Category</h3>
          {Object.keys(categoryData).length > 0
            ? <div style={{ height:220 }}><Pie data={pieData} options={{ maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ color:'#6b6b80', padding:12, font:{family:'DM Sans', size:12} } }, tooltip:{ backgroundColor:'#1c1c28', borderColor:'rgba(255,255,255,0.07)', borderWidth:1, titleColor:'#e8e8f0', bodyColor:'#6b6b80' } } }} /></div>
            : <p style={{ color:'var(--text-muted)', textAlign:'center', paddingTop:80 }}>No data yet</p>
          }
        </div>

        {/* Line */}
        <div className="glass fade-up" style={{ padding:28, animationDelay:'280ms' }}>
          <h3 style={{ margin:'0 0 20px', fontSize:16, fontWeight:700 }}>Weekly Trend</h3>
          {Object.keys(weeklyTrend).length > 0
            ? <div style={{ height:220 }}><Line data={lineData} options={chartOptions} /></div>
            : <p style={{ color:'var(--text-muted)', textAlign:'center', paddingTop:80 }}>No weekly data yet</p>
          }
        </div>
      </div>
    </div>
  );
}

export default Dashboard;