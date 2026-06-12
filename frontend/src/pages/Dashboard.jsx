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

  return (
    <div className={`app-layout ${collapsed ? 'app-layout--collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="main-content">
        <Navbar pageTitle="My Tasks" />
        <div className="page-body">
          {error && <div className="alert alert--error">{error}</div>}
          {success && <div className="alert alert--success">{success}</div>}

          {/* Stats Row */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--blue">📋</div>
              <div className="stat-card__info">
                <span className="stat-card__value">{tasks.length}</span>
                <span className="stat-card__label">Total Tasks</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--yellow">⏳</div>
              <div className="stat-card__info">
                <span className="stat-card__value">{pendingCount}</span>
                <span className="stat-card__label">Pending</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--green">✅</div>
              <div className="stat-card__info">
                <span className="stat-card__value">{completedCount}</span>
                <span className="stat-card__label">Completed</span>
              </div>
            </div>
          </div>

          {/* Create Task Form */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">Create New Task</h2>
            </div>
            <form className="task-form" onSubmit={handleCreate}>
              <div className="task-form__row">
                <div className="form-group form-group--flex">
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
                <div className="form-group form-group--flex">
                  <label className="form-label" htmlFor="task-desc">Description</label>
                  <input
                    id="task-desc"
                    type="text"
                    className="form-input"
                    placeholder="Optional description..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn--primary" disabled={submitting}>
                  {submitting ? <span className="btn-spinner"></span> : '+ Add Task'}
                </button>
              </div>
            </form>
          </div>

          {/* Task List */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">My Task List</h2>
              <span className="badge">{tasks.length} tasks</span>
            </div>
            {loading ? (
              <div className="loading-center"><div className="spinner"></div></div>
            ) : tasks.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state__icon">📭</span>
                <p>No tasks yet. Create your first task above!</p>
              </div>
            ) : (
              <div className="task-list">
                {tasks.map((task) => (
                  <div key={task._id} className={`task-item task-item--${task.status}`}>
                    {editingTask === task._id ? (
                      <div className="task-item__edit">
                        <input
                          type="text"
                          className="form-input"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          placeholder="Task title"
                        />
                        <input
                          type="text"
                          className="form-input"
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
                        <div className="task-item__edit-actions">
                          <button className="btn btn--success btn--sm" onClick={() => handleUpdate(task._id)}>Save</button>
                          <button className="btn btn--ghost btn--sm" onClick={() => setEditingTask(null)}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="task-item__left">
                          <span className={`task-status-dot task-status-dot--${task.status}`}></span>
                          <div className="task-item__info">
                            <h3 className="task-item__title">{task.title}</h3>
                            {task.description && <p className="task-item__desc">{task.description}</p>}
                            <div className="task-item__meta">
                              <span className={`status-badge status-badge--${task.status}`}>{task.status}</span>
                              <span className="task-item__date">
                                {new Date(task.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="task-item__actions">
                          <button className="btn btn--ghost btn--sm" onClick={() => handleEdit(task)}>✏️ Edit</button>
                          <button className="btn btn--danger btn--sm" onClick={() => handleDelete(task._id)}>🗑️ Delete</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
