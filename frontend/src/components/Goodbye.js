
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

function Goodbye() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => navigate('/'), 2200);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <div className="fade-up" style={{ textAlign:'center' }}>
        <div style={{ fontSize:64, marginBottom:24 }}>👋</div>
        <h1 style={{ fontSize:36, fontWeight:800, color:'var(--text)', margin:'0 0 12px' }}>See you next time!</h1>
        <p style={{ color:'var(--text-muted)', fontSize:14 }}>Your financial data is safe and sound.</p>
      </div>
      <Footer />
    </div>
  );
}

export default Goodbye;
