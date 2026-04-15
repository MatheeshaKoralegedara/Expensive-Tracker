
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/dashboard', icon: '◉', label: 'Dashboard' },
  { path: '/expenses',  icon: '≡',  label: 'Expenses'  },
  { path: '/add',       icon: '+',  label: 'Add Expense' },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username') || 'User';
  const initial = username.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/goodbye');
  };

  return (
    <div style={{
      width: 240, minHeight: '100vh', background: 'var(--surface)',
      borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
      padding: '28px 16px', position: 'sticky', top: 0, flexShrink: 0
    }}>
      {/* Brand */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:36, paddingLeft:4 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg, var(--accent), #9c88ff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>💰</div>
        <span style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:18, color:'var(--text)' }}>SpendWise</span>
      </div>

      {/* User */}
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 12px', background:'var(--surface-2)', borderRadius:14, marginBottom:28, border:'1px solid var(--border)' }}>
        <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg, var(--accent-2), var(--yellow))', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:16, flexShrink:0, color:'#fff' }}>{initial}</div>
        <div style={{ overflow:'hidden' }}>
          <p style={{ margin:0, fontWeight:600, fontSize:14, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{username}</p>
          <p style={{ margin:0, fontSize:11, color:'var(--text-muted)' }}>Member</p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display:'flex', flexDirection:'column', gap:4, flex:1 }}>
        <p style={{ fontSize:11, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8, paddingLeft:4 }}>Menu</p>
        {navItems.map(({ path, icon, label }) => (
          <button key={path} onClick={() => navigate(path)}
            className={`nav-item ${location.pathname === path ? 'active' : ''}`}>
            <span style={{ fontSize:16, width:20, textAlign:'center', opacity:0.8 }}>{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <button onClick={handleLogout} style={{
        display:'flex', alignItems:'center', gap:10, padding:'12px 16px',
        borderRadius:12, cursor:'pointer', background:'rgba(255,107,107,0.08)',
        border:'1px solid rgba(255,107,107,0.15)', color:'var(--red)',
        fontFamily:'Syne, sans-serif', fontWeight:600, fontSize:14,
        transition:'all 0.2s', width:'100%'
      }}
        onMouseEnter={e => e.currentTarget.style.background='rgba(241, 0, 0, 0.82)'}
        onMouseLeave={e => e.currentTarget.style.background='rgba(252, 98, 98, 0.19)'}
      >
        <span style={{ fontSize:16 }}>⎋</span> Sign out
      </button>
    </div>
  );
}

export default Sidebar;