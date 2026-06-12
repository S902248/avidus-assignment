import { useState, useEffect } from 'react';
import { getAllTasksApi, deleteAnyTaskApi } from '../../api/admin';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

const TaskMonitor = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchTasks = async () => {
    try {
      const res = await getAllTasksApi();
      setTasks(res.data.tasks);
    } catch {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete task "${title}"?`)) return;
    try {
      await deleteAnyTaskApi(id);
      showSuccess(`Task "${title}" deleted.`);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  return (
    <div className={`app-layout ${collapsed ? 'app-layout--collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="main-content">
        <Navbar pageTitle="Task Monitor" collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="page-body">
          {error && <div className="alert alert--error">{error}</div>}
          {success && <div className="alert alert--success">{success}</div>}

          <div className="card">
            <div className="card__header">
              <h2 className="card__title">All Tasks</h2>
              <div className="filter-group">
                {['all', 'pending', 'completed'].map((f) => (
                  <button
                    key={f}
                    className={`filter-btn ${filter === f ? 'filter-btn--active' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
                <span className="badge">{filteredTasks.length}</span>
              </div>
            </div>
            {loading ? (
              <div className="loading-center"><div className="spinner"></div></div>
            ) : filteredTasks.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state__icon">🔍</span>
                <p>No tasks found for the selected filter.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Assigned To</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((task, idx) => (
                      <tr key={task._id}>
                        <td className="table-cell--muted">{idx + 1}</td>
                        <td className="table-cell--bold">{task.title}</td>
                        <td className="table-cell--muted">{task.description || '—'}</td>
                        <td>
                          <div className="table-user">
                            <div className="table-avatar table-avatar--sm">
                              {task.userId?.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div>
                              <div>{task.userId?.name || 'Deleted User'}</div>
                              <div className="table-cell--muted" style={{ fontSize: '0.75rem' }}>
                                {task.userId?.email || ''}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge status-badge--${task.status}`}>{task.status}</span>
                        </td>
                        <td className="table-cell--muted">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <button
                            className="btn btn--danger btn--sm"
                            onClick={() => handleDelete(task._id, task.title)}
                          >
                            🗑️ Delete
                          </button>
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

export default TaskMonitor;
