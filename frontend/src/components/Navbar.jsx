import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const Navbar = ({ pageTitle, collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [latestNotification, setLatestNotification] = useState(null);

  useEffect(() => {
    // Connect to socket if the user is an Admin
    if (user?.role === 'Admin') {
      const socket = io('https://avidus-assignment-0mnw.onrender.com');
      
      socket.on('connect', () => {
        socket.emit('join_admin');
      });

      socket.on('new_activity', (data) => {
        setLatestNotification(data);
        setShowToast(true);
        // Hide toast after 5 seconds
        setTimeout(() => setShowToast(false), 5000);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <>
      {showToast && latestNotification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--accent-purple)',
          boxShadow: 'var(--shadow-lg)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          zIndex: 1000,
          minWidth: '250px',
          animation: 'slideDown 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-purple-light)' }}>New Activity</strong>
            <button onClick={() => setShowToast(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            {latestNotification.details}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {new Date(latestNotification.createdAt).toLocaleTimeString()}
          </div>
        </div>
      )}
      <header className="navbar">
        <div className="navbar__left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {setCollapsed && (
            <button 
              className="mobile-menu-btn" 
              onClick={() => setCollapsed(!collapsed)}
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'none', padding: '0.5rem' }}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          )}
          <div className="navbar__title-group">
            <h1 className="navbar__title">{pageTitle}</h1>
            <span className="navbar__date">{currentDate}</span>
          </div>
        </div>
        <div className="navbar__right">
          <div className="navbar__actions">
            <button className="icon-btn" title="Search">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <button className="icon-btn" title="Notifications" style={{ position: 'relative' }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              {showToast && (
                <span style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', backgroundColor: 'var(--accent-red)', borderRadius: '50%' }}></span>
              )}
            </button>
            <div className="navbar__user">
              <div className="navbar__avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
