
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

function Welcome() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const username = localStorage.getItem('username') || 'there';

  useEffect(() => {
    let value = 0;
    const interval = setInterval(() => {
      value += 4;
      setProgress(value);
      if (value >= 100) { clearInterval(interval); navigate('/dashboard'); }
    }, 120);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'var(--bg)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)', top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none' }} />
      <div className="fade-up" style={{ textAlign:'center', zIndex:1 }}>
        <div style={{ fontSize:64, marginBottom:24 }}>👋</div>
        <h1 style={{ fontSize:42, fontWeight:800, margin:'0 0 12px', background:'linear-gradient(135deg, var(--text), var(--accent))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          Welcome back, {username}!
        </h1>
        <p style={{ color:'var(--text-muted)', fontSize:16, marginBottom:48 }}>Setting up your dashboard...</p>
        <div style={{ width:280, height:4, background:'var(--surface-2)', borderRadius:2, overflow:'hidden', margin:'0 auto' }}>
          <div style={{ height:'100%', background:'linear-gradient(90deg, var(--accent), var(--accent-3))', borderRadius:2, width:`${progress}%`, transition:'width 0.1s linear' }} />
        </div>
        <p style={{ color:'var(--text-muted)', marginTop:12, fontSize:13 }}>{progress}%</p>
      </div>
      <Footer />
    </div>
  );
}

export default Welcome;
