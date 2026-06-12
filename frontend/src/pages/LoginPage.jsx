import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
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
    setLoading(true);
    setError('');
    try {
      const res = await loginApi(form);
      login(res.data);
      if (res.data.user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
            <div className="auth-logo-top-icon">
              ✓
            </div>
          </div>
          
          <h2 className="split-right-title">Welcome Back</h2>
          <p className="split-right-subtitle">Enter your credentials to access the dashboard</p>

          {error && <div className="split-alert">{error}</div>}

          <form className="split-auth-form" onSubmit={handleSubmit}>
            <div className="split-form-group">
              <label className="split-form-label" htmlFor="email">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className="split-form-input"
                placeholder="staff@taskbar.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="split-form-group">
              <label className="split-form-label" htmlFor="password">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Password
              </label>
              <div className="split-form-input-wrap">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="split-form-input"
                  placeholder="••••••••"
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

            <button type="submit" className="split-btn-primary" disabled={loading}>
              {loading ? (
                <span className="btn-spinner" style={{ width: '20px', height: '20px', borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }}></span>
              ) : (
                <>Access Dashboard <span style={{ marginLeft: '4px' }}>→</span></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
            Don't have an account?{' '}
            <Link to="/register" className="split-link">Create one</Link>
          </p>

          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', fontSize: '0.85rem', color: '#64748b', border: '1px solid #e2e8f0' }}>
            <p style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>Sample Credentials:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <p style={{ margin: 0 }}><strong>Admin:</strong> admin@admin.com / admin123</p>
              <p style={{ margin: 0 }}><strong>User:</strong> user@user.com / user123</p>
            </div>
          </div>
        </div>

        <div className="split-auth-footer">
          © {new Date().getFullYear()} Taskbar System
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
