import { useState, useEffect } from 'react';
import { userAPI } from '../api';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await userAPI.getAll();
      setUsers(res.data.data.users);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"?`)) return;

    try {
      await userAPI.delete(id);
      toast.success('User deleted!');
      fetchUsers();
    } catch (error) {
      const message = error.response?.data?.message || 'Delete failed';
      toast.error(message);
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="admin-panel">
      <div className="dashboard-header">
        <h1>Admin Panel 🔐</h1>
        <p>Manage all users</p>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>{user.role}</span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-delete"
                    onClick={() => handleDelete(user._id, user.name)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>{users.length}</h3>
          <p>Total Users</p>
        </div>
        <div className="stat-card">
          <h3>{users.filter((u) => u.role === 'admin').length}</h3>
          <p>Admins</p>
        </div>
        <div className="stat-card">
          <h3>{users.filter((u) => u.role === 'user').length}</h3>
          <p>Regular Users</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
