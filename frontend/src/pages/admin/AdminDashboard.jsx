import { useState, useEffect } from 'react';
import { getAnalyticsApi, getAllTasksApi } from '../../api/admin';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [analyticsRes, tasksRes] = await Promise.all([
          getAnalyticsApi(),
          getAllTasksApi()
        ]);
        setAnalytics(analyticsRes.data);
        setTasks(tasksRes.data.tasks || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const completionRate = analytics
    ? analytics.totalTasks > 0
      ? Math.round((analytics.completedTasks / analytics.totalTasks) * 100)
      : 0
    : 0;

  const statCards = analytics ? [
    { label: 'Total Users', value: analytics.totalUsers, subtext: '+2 this week', icon: '👥', color: 'purple' },
    { label: 'Total Tasks', value: analytics.totalTasks, subtext: 'No change', icon: '📋', color: 'yellow' },
    { label: 'Completed', value: analytics.completedTasks, subtext: `${completionRate}% rate`, icon: '✅', color: 'green' },
    { label: 'Pending', value: analytics.pendingTasks, subtext: `${analytics.pendingTasks > 0 ? analytics.pendingTasks + ' overdue' : '0 overdue'}`, icon: '⏳', color: 'blue' }
  ] : [];

  return (
    <div className={`app-layout ${collapsed ? 'app-layout--collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="main-content">
        <Navbar pageTitle="Admin Dashboard" />
        <div className="page-body">
          {loading ? (
            <div className="loading-center"><div className="spinner"></div></div>
          ) : (
            <>
              {/* Top Row Cards */}
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

              {/* Mid Row Panels */}
              <div className="dash-mid-row">
                {/* Task Completion Panel */}
                <div className="dash-panel">
                  <div className="dash-panel-header">
                    <span className="dash-panel-title">Task completion rate</span>
                    <a href="#viewall" className="dash-link">View all ↗</a>
                  </div>
                  <div className="completion-huge">
                    {completionRate}% <span className="completion-sub">{analytics.completedTasks} of {analytics.totalTasks} completed</span>
                  </div>
                  
                  <div className="comp-bar-container">
                    <div className="comp-bar">
                      <div className="comp-bar-fill" style={{ width: `${completionRate}%` }}></div>
                    </div>
                    <div className="comp-labels">
                      <span>{analytics.completedTasks} completed</span>
                      <span>{analytics.pendingTasks} pending</span>
                    </div>
                  </div>

                  <div className="task-list" style={{ marginTop: '2rem' }}>
                    {tasks.slice(0, 4).map((task, i) => (
                      <div className="task-item" key={task._id || i}>
                        <div className={`task-dot ${task.status === 'completed' ? 'green' : 'orange'}`}></div>
                        <div className="task-info">
                          <div className="task-name">{task.title}</div>
                        </div>
                        <div className="task-meta">
                          <span className={`task-pill ${task.status === 'completed' ? 'done' : 'pending'}`}>
                            {task.status === 'completed' ? 'Done' : 'Pending'}
                          </span>
                          <span className="task-date">
                            {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    ))}
                    {tasks.length === 0 && (
                      <div style={{ color: '#a0aec0', fontSize: '0.85rem' }}>No tasks found.</div>
                    )}
                  </div>
                </div>

                {/* Quick Stats Panel */}
                <div className="dash-panel">
                  <div className="dash-panel-header">
                    <span className="dash-panel-title">Quick stats</span>
                  </div>
                  <div className="quick-stats-grid">
                    <div className="q-stat">
                      <div className="q-stat-val">{analytics.totalUsers}</div>
                      <div className="q-stat-label">Registered<br/>users</div>
                    </div>
                    <div className="q-stat">
                      <div className="q-stat-val">{analytics.pendingTasks}</div>
                      <div className="q-stat-label">Active<br/>tasks</div>
                    </div>
                    <div className="q-stat">
                      <div className="q-stat-val">{completionRate}%</div>
                      <div className="q-stat-label">Completion<br/>rate</div>
                    </div>
                    <div className="q-stat">
                      <div className="q-stat-val">1</div>
                      <div className="q-stat-label">Admins</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
