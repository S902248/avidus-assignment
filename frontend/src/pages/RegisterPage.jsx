import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'User' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-blob auth-blob--1"></div>
        <div className="auth-blob auth-blob--2"></div>
        <div className="auth-blob auth-blob--3"></div>
      </div>
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="auth-logo">
            <span className="auth-logo__icon">🚀</span>
          </div>
          <h1 className="auth-card__title">Create Account</h1>
          <p className="auth-card__subtitle">Join TaskManager today</p>
        </div>

        {error && <div className="alert alert--error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              className="form-input"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
              type="email"
              name="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              name="password"
              className="form-input"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="role">Account Role</label>
            <select
              id="role"
              name="role"
              className="form-input form-select"
              value={form.role}
              onChange={handleChange}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? <span className="btn-spinner"></span> : 'Create Account'}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
