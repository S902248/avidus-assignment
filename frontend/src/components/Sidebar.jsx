import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__header">
        <div className="sidebar__logo">
          {!collapsed && (
            <span className="sidebar__logo-text">
              <span className="sidebar__logo-accent">Task</span>Manager
            </span>
          )}
          {collapsed && <span className="sidebar__logo-icon">TM</span>}
        </div>
        <button className="sidebar__toggle" onClick={() => setCollapsed(!collapsed)} title="Toggle Sidebar">
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar__nav">
        <div className="sidebar__section">
          {!collapsed && <span className="sidebar__section-label">Main</span>}
          <NavLink to="/dashboard" className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}>
            <span className="sidebar__icon">📋</span>
            {!collapsed && <span>My Tasks</span>}
          </NavLink>
        </div>

        {user?.role === 'Admin' && (
          <div className="sidebar__section">
            {!collapsed && <span className="sidebar__section-label">Admin</span>}
            <NavLink to="/admin" className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`} end>
              <span className="sidebar__icon">📊</span>
              {!collapsed && <span>Dashboard</span>}
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}>
              <span className="sidebar__icon">👥</span>
              {!collapsed && <span>User Management</span>}
            </NavLink>
            <NavLink to="/admin/tasks" className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}>
              <span className="sidebar__icon">🗂️</span>
              {!collapsed && <span>Task Monitor</span>}
            </NavLink>
            <NavLink to="/admin/activity-logs" className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}>
              <span className="sidebar__icon">📜</span>
              {!collapsed && <span>Activity Logs</span>}
            </NavLink>
          </div>
        )}
      </nav>

      <div className="sidebar__footer">
        {!collapsed && (
          <div className="sidebar__user-info">
            <div className="sidebar__avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div className="sidebar__user-details">
              <span className="sidebar__user-name">{user?.name}</span>
              <span className={`sidebar__role-badge sidebar__role-badge--${user?.role?.toLowerCase()}`}>
                {user?.role}
              </span>
            </div>
          </div>
        )}
        <button className="sidebar__logout-btn" onClick={handleLogout} title="Logout">
          <span>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
