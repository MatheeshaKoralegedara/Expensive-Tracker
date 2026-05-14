import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Footer from './Footer';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. No token provided.');
        return;
      }

      try {
        const response = await api.post('/auth/verify-email', null, {
          params: { token }
        });
        
        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (error) {
        setStatus('error');
        if (error.response?.data?.message) {
          setMessage(error.response.data.message);
        } else {
          setMessage('Email verification failed. The link may have expired or is invalid.');
        }
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background orbs */}
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)',
        top: -100, left: -100, pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,107,0.08) 0%, transparent 70%)',
        bottom: -80, right: -80, pointerEvents: 'none'
      }} />

      <div className="fade-up" style={{ width: '100%', maxWidth: 420, padding: '0 24px', textAlign: 'center' }}>
        {/* Card */}
        <div style={{
          background: 'var(--surface)', 
          border: '1px solid var(--border)',
          borderRadius: 24, 
          padding: '50px 32px'
        }}>
          {status === 'verifying' && (
            <>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6c63ff, #38ef7d)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 40,
                margin: '0 auto 20px',
                animation: 'spin 2s linear infinite'
              }}>
                ⏳
              </div>
              <h2 style={{ margin: '0 0 16px', fontSize: 22, fontWeight: 700 }}>Verifying Email</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
                {message}
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(46, 213, 115, 0.1)',
                border: '2px solid #2ed573',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 40,
                margin: '0 auto 20px'
              }}>
                ✓
              </div>
              <h2 style={{ margin: '0 0 16px', fontSize: 22, fontWeight: 700, color: '#2ed573' }}>Success!</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>
                {message}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                Redirecting you to login in 3 seconds...
              </p>
              <button 
                onClick={() => navigate('/')}
                style={{
                  marginTop: 20,
                  padding: '10px 30px',
                  background: 'linear-gradient(135deg, #6c63ff, #38ef7d)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Go to Login Now
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(255, 107, 107, 0.1)',
                border: '2px solid var(--red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 40,
                margin: '0 auto 20px'
              }}>
                ✕
              </div>
              <h2 style={{ margin: '0 0 16px', fontSize: 22, fontWeight: 700, color: 'var(--red)' }}>Verification Failed</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>
                {message}
              </p>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
                <p>What you can try:</p>
                <ul style={{ textAlign: 'left', display: 'inline-block' }}>
                  <li>Check if the link has expired</li>
                  <li>Try registering again</li>
                  <li>Contact support if the issue persists</li>
                </ul>
              </div>
              <button 
                onClick={() => navigate('/')}
                style={{
                  marginTop: 20,
                  padding: '10px 30px',
                  background: '#6c63ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Return to Login
              </button>
            </>
          )}
        </div>

        <style>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
      <Footer />
    </div>
  );
}

export default VerifyEmail;
