
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import spendwiseLogo from '../assets/spendwise-logo.png';
import api from '../api';
import Footer from './Footer';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Password strength requirements
  const passwordRequirements = {
    minLength: formData.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecialChar: /[@$!%*?&]/.test(formData.password),
  };

  // Calculate password strength
  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 20;
    if (/[A-Z]/.test(pwd)) strength += 20;
    if (/[a-z]/.test(pwd)) strength += 20;
    if (/\d/.test(pwd)) strength += 20;
    if (/[@$!%*?&]/.test(pwd)) strength += 20;
    return strength;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Update password strength when password changes
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3 || formData.username.length > 20) {
      newErrors.username = 'Username must be between 3 and 20 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Za-z0-9+_.-]+@(.+)$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!passwordRequirements.hasUpperCase) {
      newErrors.password = 'Password must contain uppercase letter';
    } else if (!passwordRequirements.hasLowerCase) {
      newErrors.password = 'Password must contain lowercase letter';
    } else if (!passwordRequirements.hasNumber) {
      newErrors.password = 'Password must contain a number';
    } else if (!passwordRequirements.hasSpecialChar) {
      newErrors.password = 'Password must contain special character (@$!%*?&)';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setGeneralError('');
    setSuccessMessage('');

    try {
      const response = await api.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        agreeToTerms: formData.agreeToTerms,
      });

      setSuccessMessage(response.data.message || 'Registration successful! Redirecting...');
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setGeneralError(error.response.data.message);
      } else {
        setGeneralError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return '#ff6b6b';
    if (passwordStrength < 70) return '#ffa500';
    return '#2ed573';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Fair';
    return 'Strong';
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', position: 'relative', overflow: 'hidden', paddingTop: 40, paddingBottom: 40
    }}>
      <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(67,233,123,0.1) 0%, transparent 70%)', top:-100, right:-100, pointerEvents:'none' }} />
      <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(108,99,255,0.1) 0%, transparent 70%)', bottom:-80, left:-80, pointerEvents:'none' }} />

      <div className="fade-up" style={{ width:'100%', maxWidth:500, padding:'0 24px' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <img className="auth-logo" src={spendwiseLogo} alt="SpendWise logo" />
          
          <p style={{ color:'var(--text-muted)', marginTop:1, fontSize:14 }}>Create your account and start tracking expenses</p>
        </div>

        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:24, padding:'36px 32px' }}>
          <h2 style={{ margin:'0 0 24px', fontSize:22, fontWeight:700 }}>Create account</h2>
          
          {generalError && (
            <div style={{ background:'rgba(255,107,107,0.1)', border:'1px solid rgba(255,107,107,0.25)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'var(--red)', marginBottom:16 }}>
              {generalError}
            </div>
          )}

          {successMessage && (
            <div style={{ background:'rgba(46,213,115,0.1)', border:'1px solid rgba(46,213,115,0.25)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#2ed573', marginBottom:16 }}>
              {successMessage}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {/* Username */}
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Username</label>
              <input 
                className="input-field" 
                placeholder="Choose a username (3-20 chars, letters/numbers/_)" 
                name="username"
                value={formData.username} 
                onChange={handleInputChange} 
                required 
              />
              {errors.username && <div style={{ color:'var(--red)', fontSize:12, marginTop:4 }}>{errors.username}</div>}
            </div>

            {/* Email */}
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Email</label>
              <input 
                className="input-field" 
                placeholder="your.email@example.com" 
                type="email"
                name="email"
                value={formData.email} 
                onChange={handleInputChange} 
                required 
              />
              {errors.email && <div style={{ color:'var(--red)', fontSize:12, marginTop:4 }}>{errors.email}</div>}
            </div>

            {/* First Name and Last Name */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>First Name</label>
                <input 
                  className="input-field" 
                  placeholder="John" 
                  name="firstName"
                  value={formData.firstName} 
                  onChange={handleInputChange} 
                  required 
                />
                {errors.firstName && <div style={{ color:'var(--red)', fontSize:12, marginTop:4 }}>{errors.firstName}</div>}
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Last Name</label>
                <input 
                  className="input-field" 
                  placeholder="Doe" 
                  name="lastName"
                  value={formData.lastName} 
                  onChange={handleInputChange} 
                  required 
                />
                {errors.lastName && <div style={{ color:'var(--red)', fontSize:12, marginTop:4 }}>{errors.lastName}</div>}
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Password</label>
              <input 
                className="input-field" 
                placeholder="Strong password" 
                type="password"
                name="password"
                value={formData.password} 
                onChange={handleInputChange} 
                required 
              />
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div style={{ marginTop:8 }}>
                  <div style={{ display:'flex', gap:4, marginBottom:6 }}>
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i}
                        style={{
                          flex: 1,
                          height: 4,
                          borderRadius: 2,
                          background: i < Math.ceil(passwordStrength / 20) ? getPasswordStrengthColor() : 'var(--border)',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize:11, color: getPasswordStrengthColor(), fontWeight:600 }}>
                    Strength: {getPasswordStrengthText()}
                  </div>
                  
                  {/* Requirements Checklist */}
                  <div style={{ fontSize:11, marginTop:8, color:'var(--text-muted)' }}>
                    <div style={{ color: passwordRequirements.minLength ? '#2ed573' : 'var(--text-muted)', marginBottom:4 }}>
                      {passwordRequirements.minLength ? '✓' : '○'} At least 8 characters
                    </div>
                    <div style={{ color: passwordRequirements.hasUpperCase ? '#2ed573' : 'var(--text-muted)', marginBottom:4 }}>
                      {passwordRequirements.hasUpperCase ? '✓' : '○'} Uppercase letter
                    </div>
                    <div style={{ color: passwordRequirements.hasLowerCase ? '#2ed573' : 'var(--text-muted)', marginBottom:4 }}>
                      {passwordRequirements.hasLowerCase ? '✓' : '○'} Lowercase letter
                    </div>
                    <div style={{ color: passwordRequirements.hasNumber ? '#2ed573' : 'var(--text-muted)', marginBottom:4 }}>
                      {passwordRequirements.hasNumber ? '✓' : '○'} Number
                    </div>
                    <div style={{ color: passwordRequirements.hasSpecialChar ? '#2ed573' : 'var(--text-muted)' }}>
                      {passwordRequirements.hasSpecialChar ? '✓' : '○'} Special character (@$!%*?&)
                    </div>
                  </div>
                </div>
              )}
              {errors.password && <div style={{ color:'var(--red)', fontSize:12, marginTop:4 }}>{errors.password}</div>}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Confirm Password</label>
              <input 
                className="input-field" 
                placeholder="Re-enter password" 
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword} 
                onChange={handleInputChange} 
                required 
              />
              {formData.confirmPassword && (
                <div style={{ fontSize:12, marginTop:4, color: formData.password === formData.confirmPassword ? '#2ed573' : 'var(--red)' }}>
                  {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </div>
              )}
              {errors.confirmPassword && <div style={{ color:'var(--red)', fontSize:12, marginTop:4 }}>{errors.confirmPassword}</div>}
            </div>

            {/* Terms & Conditions */}
            <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginTop:8 }}>
              <input 
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms} 
                onChange={handleInputChange}
                style={{ width:18, height:18, marginTop:2, cursor:'pointer' }}
                required
              />
              <label style={{ fontSize:12, color:'var(--text-muted)', cursor:'pointer' }}>
                I agree to the <a href="#" style={{ color:'var(--accent)', textDecoration:'none' }}>Terms & Conditions</a> and <a href="#" style={{ color:'var(--accent)', textDecoration:'none' }}>Privacy Policy</a>
              </label>
            </div>
            {errors.agreeToTerms && <div style={{ color:'var(--red)', fontSize:12 }}>{errors.agreeToTerms}</div>}

            {/* Submit Button */}
            <button 
              className="btn-primary" 
              type="submit" 
              disabled={loading} 
              style={{ marginTop:16, opacity:loading?0.7:1, background:'linear-gradient(135deg, var(--accent-3), #2ed573)' }}>
              {loading ? 'Creating account...' : 'Get started →'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:24, fontSize:13, color:'var(--text-muted)' }}>
            Already have an account?{' '}
            <a href="/" style={{ color:'var(--accent)', textDecoration:'none', fontWeight:600 }}>Sign in</a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Register;

