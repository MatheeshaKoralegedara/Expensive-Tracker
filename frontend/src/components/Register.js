
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    axios.post('http://localhost:8080/api/auth/register', { username, password })
      .then(() => { navigate('/'); })
      .catch(() => {
        setError('Registration failed. Username may already exist.');
        setLoading(false);
      });
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(67,233,123,0.1) 0%, transparent 70%)', top:-100, right:-100, pointerEvents:'none' }} />
      <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(108,99,255,0.1) 0%, transparent 70%)', bottom:-80, left:-80, pointerEvents:'none' }} />

      <div className="fade-up" style={{ width:'100%', maxWidth:420, padding:'0 24px' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ width:60, height:60, borderRadius:18, background:'linear-gradient(135deg, var(--accent-3), #38ef7d)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, margin:'0 auto 16px', boxShadow:'0 8px 32px rgba(67,233,123,0.3)' }}>✨</div>
          <h1 style={{ fontSize:28, fontWeight:800, color:'var(--text)', margin:0 }}>SpendWise</h1>
          <p style={{ color:'var(--text-muted)', marginTop:6, fontSize:14 }}>Start your financial journey today</p>
        </div>

        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:24, padding:'36px 32px' }}>
          <h2 style={{ margin:'0 0 24px', fontSize:22, fontWeight:700 }}>Create account</h2>
          <form onSubmit={handleRegister} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Username</label>
              <input className="input-field" placeholder="Choose a username" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Password</label>
              <input className="input-field" placeholder="Choose a password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {error && <div style={{ background:'rgba(255,107,107,0.1)', border:'1px solid rgba(255,107,107,0.25)', borderRadius:10, padding:'10px 14px', fontSize:13, color:'var(--red)' }}>{error}</div>}
            <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop:8, opacity:loading?0.7:1, background:'linear-gradient(135deg, var(--accent-3), #2ed573)' }}>
              {loading ? 'Creating account...' : 'Get started →'}
            </button>
          </form>
          <p style={{ textAlign:'center', marginTop:24, fontSize:13, color:'var(--text-muted)' }}>
            Already have an account?{' '}
            <a href="/" style={{ color:'var(--accent)', textDecoration:'none', fontWeight:600 }}>Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;

