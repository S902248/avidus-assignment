import { useState, useEffect } from 'react';
import { getActivityLogsApi } from '../../api/admin';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

const ACTION_COLORS = {
  LOGIN: 'blue',
  TASK_CREATED: 'green',
  TASK_UPDATED: 'yellow',
  TASK_DELETED: 'red',
};

const ACTION_ICONS = {
  LOGIN: '🔐',
  TASK_CREATED: '✅',
  TASK_UPDATED: '✏️',
  TASK_DELETED: '🗑️',
};

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getActivityLogsApi();
        setLogs(res.data.logs);
      } catch {
        console.error('Failed to load logs');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.action === filter;
  });

  return (
    <div className={`app-layout ${collapsed ? 'app-layout--collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="main-content">
        <Navbar pageTitle="Activity Logs" />
        <div className="page-body">
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">Activity Logs</h2>
              <div className="filter-group">
                {['all', 'LOGIN', 'TASK_CREATED', 'TASK_UPDATED', 'TASK_DELETED'].map((f) => (
                  <button
                    key={f}
                    className={`filter-btn ${filter === f ? 'filter-btn--active' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f === 'all' ? 'All' : f.replace('_', ' ')}
                  </button>
                ))}
                <span className="badge">{filteredLogs.length}</span>
              </div>
            </div>
            {loading ? (
              <div className="loading-center"><div className="spinner"></div></div>
            ) : filteredLogs.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state__icon">📜</span>
                <p>No activity logs found.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>User</th>
                      <th>Action</th>
                      <th>Details</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log, idx) => (
                      <tr key={log._id}>
                        <td className="table-cell--muted">{idx + 1}</td>
                        <td>
                          <div className="table-user">
                            <div className="table-avatar table-avatar--sm">
                              {log.userId?.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div>
                              <div>{log.userId?.name || 'Unknown'}</div>
                              <div className="table-cell--muted" style={{ fontSize: '0.75rem' }}>
                                {log.userId?.email || ''}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`action-badge action-badge--${ACTION_COLORS[log.action] || 'blue'}`}>
                            {ACTION_ICONS[log.action]} {log.action}
                          </span>
                        </td>
                        <td className="table-cell--muted">{log.details || '—'}</td>
                        <td className="table-cell--muted">
                          <div>{new Date(log.createdAt).toLocaleDateString()}</div>
                          <div style={{ fontSize: '0.75rem' }}>{new Date(log.createdAt).toLocaleTimeString()}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
