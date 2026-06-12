import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'User' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await registerApi(form);
      login(res.data);
      if (res.data.user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-auth-page">
      {/* LEFT SIDE */}
      <div className="split-auth-left">
        <div className="split-auth-left-content">
          <div className="staff-portal-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            TASK PORTAL
          </div>
          
          <h1 className="split-auth-title">Taskbar</h1>
          <p className="split-auth-subtitle">Management System</p>
          
          <div className="split-auth-features">
            <span className="feature-pill">
              <span className="dot"></span> Dashboard Access
            </span>
            <span className="feature-pill">
              <span className="dot"></span> Project Management
            </span>
            <span className="feature-pill">
              <span className="dot"></span> Team Collaboration
            </span>
            <span className="feature-pill">
              <span className="dot"></span> Activity Tracking
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="split-auth-right">
        <div className="split-auth-right-content">
          <div className="auth-logo-top">
            <div className="auth-logo-top-icon" style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}>
              +
            </div>
          </div>
          
          <h2 className="split-right-title">Create Account</h2>
          <p className="split-right-subtitle">Join Taskbar System today</p>

          {error && <div className="split-alert">{error}</div>}

          <form className="split-auth-form" onSubmit={handleSubmit}>
            <div className="split-form-group">
              <label className="split-form-label" htmlFor="name">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                className="split-form-input"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="split-form-group">
              <label className="split-form-label" htmlFor="reg-email">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                name="email"
                className="split-form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="split-form-group">
              <label className="split-form-label" htmlFor="reg-password">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Password
              </label>
              <div className="split-form-input-wrap">
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="split-form-input"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '0.2rem' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {showPassword ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div className="split-form-group">
              <label className="split-form-label" htmlFor="role">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                Account Role
              </label>
              <select
                id="role"
                name="role"
                className="split-form-input"
                style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%2394a3b8\' d=\'M6 8L1 3h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
                value={form.role}
                onChange={handleChange}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="split-btn-primary" disabled={loading} style={{ background: '#10b981', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>
              {loading ? (
                <span className="btn-spinner" style={{ width: '20px', height: '20px', borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }}></span>
              ) : (
                <>Create Account <span style={{ marginLeft: '4px' }}>→</span></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" className="split-link">Sign in</Link>
          </p>
        </div>

        <div className="split-auth-footer">
          © {new Date().getFullYear()} Taskbar System
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
