import { useState, useEffect } from 'react';
import { getTasksApi, createTaskApi, updateTaskApi, deleteTaskApi } from '../api/tasks';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', status: 'pending' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await getTasksApi();
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

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      await createTaskApi(form);
      setForm({ title: '', description: '' });
      showSuccess('Task created successfully!');
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task._id);
    setEditForm({ title: task.title, description: task.description, status: task.status });
  };

  const handleUpdate = async (id) => {
    try {
      await updateTaskApi(id, editForm);
      setEditingTask(null);
      showSuccess('Task updated!');
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTaskApi(id);
      showSuccess('Task deleted!');
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const statCards = [
    { label: 'Total Tasks', value: totalTasks, subtext: 'All your tasks', icon: '📋', color: 'purple' },
    { label: 'Pending', value: pendingCount, subtext: 'Needs attention', icon: '⏳', color: 'yellow' },
    { label: 'Completed', value: completedCount, subtext: 'Done', icon: '✅', color: 'green' },
    { label: 'Completion Rate', value: `${completionRate}%`, subtext: 'Overall progress', icon: '📈', color: 'blue' }
  ];

  return (
    <div className={`app-layout user-light-theme ${collapsed ? 'app-layout--collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="main-content">
        <Navbar pageTitle="Dashboard" collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="page-body">
          {error && <div className="alert alert--error">{error}</div>}
          {success && <div className="alert alert--success">{success}</div>}

          {/* Stats Row */}
          <div className="dash-top-row">
            {statCards.map(card => (
              <div key={card.label} className={`v-stat-card card-${card.color}`}>
                <div className="v-stat-icon-wrapper">{card.icon}</div>
                <div className="v-stat-value">{card.value}</div>
                <div className="v-stat-label">{card.label}</div>
                <div className="v-stat-subtext">{card.subtext}</div>
              </div>
            ))}
          </div>

          <div className="dash-mid-row">
            {/* Left Column: Task List */}
            <div className="dash-panel">
              <div className="dash-panel-header">
                <span className="dash-panel-title">My Task List</span>
                <span className="badge">{tasks.length} tasks</span>
              </div>
              
              {loading ? (
                <div className="loading-center"><div className="spinner"></div></div>
              ) : tasks.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-state__icon">📭</span>
                  <p>No tasks yet. Create your first task!</p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Task Name</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task, idx) => (
                        <tr key={task._id}>
                          {editingTask === task._id ? (
                            <td colSpan="5">
                              <div className="task-item__edit" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <input
                                  type="text"
                                  className="form-input"
                                  style={{ flex: 1 }}
                                  value={editForm.title}
                                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                  placeholder="Task title"
                                />
                                <input
                                  type="text"
                                  className="form-input"
                                  style={{ flex: 1 }}
                                  value={editForm.description}
                                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                  placeholder="Description"
                                />
                                <select
                                  className="form-input form-select"
                                  value={editForm.status}
                                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="completed">Completed</option>
                                </select>
                                <div className="task-item__edit-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button className="btn btn--success btn--sm" onClick={() => handleUpdate(task._id)}>Save</button>
                                  <button className="btn btn--ghost btn--sm" onClick={() => setEditingTask(null)}>Cancel</button>
                                </div>
                              </div>
                            </td>
                          ) : (
                            <>
                              <td className="table-cell--muted">{idx + 1}</td>
                              <td>
                                <div style={{ fontWeight: 600, color: '#fff' }}>{task.title}</div>
                                {task.description && <div style={{ fontSize: '0.8rem', color: '#a0aec0', marginTop: '0.25rem' }}>{task.description}</div>}
                              </td>
                              <td>
                                <span className={`status-badge status-badge--${task.status}`}>{task.status}</span>
                              </td>
                              <td className="table-cell--muted">
                                {new Date(task.createdAt).toLocaleDateString()}
                              </td>
                              <td>
                                <div className="table-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button className="btn btn--ghost btn--sm" onClick={() => handleEdit(task)}>✏️ Edit</button>
                                  <button className="btn btn--danger btn--sm" onClick={() => handleDelete(task._id)}>🗑️ Delete</button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right Column: Create Task Form */}
            <div className="dash-panel">
              <div className="dash-panel-header">
                <span className="dash-panel-title">Create New Task</span>
              </div>
              <form className="task-form" onSubmit={handleCreate}>
                <div className="form-group">
                  <label className="form-label" htmlFor="task-title">Task Title</label>
                  <input
                    id="task-title"
                    type="text"
                    className="form-input"
                    placeholder="What needs to be done?"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label className="form-label" htmlFor="task-desc">Description</label>
                  <textarea
                    id="task-desc"
                    className="form-input"
                    placeholder="Optional description..."
                    rows="3"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <button type="submit" className="btn btn--primary" disabled={submitting} style={{ width: '100%', marginTop: '1.5rem' }}>
                  {submitting ? <span className="btn-spinner"></span> : '+ Add Task'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
