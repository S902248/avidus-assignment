import { useState, useEffect } from 'react';
import { getUsersApi, deleteUserApi, updateUserStatusApi, createUserApi, updateUserPasswordApi } from '../../api/admin';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user: currentUser } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'User' });
  const [newPassword, setNewPassword] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await getUsersApi();
      setUsers(res.data.users);
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}" and all their tasks?`)) return;
    try {
      await deleteUserApi(id);
      showSuccess(`User "${name}" deleted.`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await updateUserStatusApi(id, newStatus);
      showSuccess(`User status updated to ${newStatus}`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createUserApi(formData);
      showSuccess('User created successfully');
      setIsCreateModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'User' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      await updateUserPasswordApi(selectedUser._id, newPassword);
      showSuccess(`Password updated for ${selectedUser.name}`);
      setIsPasswordModalOpen(false);
      setNewPassword('');
      setSelectedUser(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  const openPasswordModal = (user) => {
    setSelectedUser(user);
    setNewPassword('');
    setIsPasswordModalOpen(true);
  };

  return (
    <div className={`app-layout ${collapsed ? 'app-layout--collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="main-content">
        <Navbar pageTitle="User Management" collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="page-body">
          {error && <div className="alert alert--error">{error}</div>}
          {success && <div className="alert alert--success">{success}</div>}

          <div className="card">
            <div className="card__header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h2 className="card__title">All Users</h2>
                <span className="badge">{users.length} users</span>
              </div>
              <button className="btn btn--primary" onClick={() => setIsCreateModalOpen(true)}>
                + Add User
              </button>
            </div>
            {loading ? (
              <div className="loading-center"><div className="spinner"></div></div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, idx) => (
                      <tr key={u._id} className={u._id === currentUser?._id ? 'table-row--current' : ''}>
                        <td className="table-cell--muted">{idx + 1}</td>
                        <td>
                          <div className="table-user">
                            <div className="table-avatar">{u.name.charAt(0).toUpperCase()}</div>
                            <span>{u.name}</span>
                            {u._id === currentUser?._id && <span className="you-badge">You</span>}
                          </div>
                        </td>
                        <td className="table-cell--muted">{u.email}</td>
                        <td>
                          <span className={`role-badge role-badge--${u.role.toLowerCase()}`}>{u.role}</span>
                        </td>
                        <td>
                          <span className={`status-badge status-badge--${u.status.toLowerCase()}`}>{u.status}</span>
                        </td>
                        <td className="table-cell--muted">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <div className="table-actions">
                            {u._id !== currentUser?._id && (
                              <>
                                <button
                                  className="btn btn--sm btn--primary"
                                  onClick={() => openPasswordModal(u)}
                                >
                                  🔑 Password
                                </button>
                                <button
                                  className={`btn btn--sm ${u.status === 'Active' ? 'btn--warning' : 'btn--success'}`}
                                  onClick={() => handleToggleStatus(u._id, u.status)}
                                >
                                  {u.status === 'Active' ? '🔒 Deactivate' : '🔓 Activate'}
                                </button>
                                <button
                                  className="btn btn--danger btn--sm"
                                  onClick={() => handleDelete(u._id, u.name)}
                                >
                                  🗑️ Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Create User Modal */}
          {isCreateModalOpen && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>Add New User</h2>
                <form onSubmit={handleCreateUser}>
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input-field" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="input-field" />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input type="password" required minLength="6" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="input-field" />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="input-field">
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn btn--secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
                    <button type="submit" className="btn btn--primary">Create User</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Password Modal */}
          {isPasswordModalOpen && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>Edit Password for {selectedUser?.name}</h2>
                <form onSubmit={handleUpdatePassword}>
                  <div className="form-group">
                    <label>New Password</label>
                    <input type="password" required minLength="6" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field" />
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn btn--secondary" onClick={() => setIsPasswordModalOpen(false)}>Cancel</button>
                    <button type="submit" className="btn btn--primary">Update Password</button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserManagement;
