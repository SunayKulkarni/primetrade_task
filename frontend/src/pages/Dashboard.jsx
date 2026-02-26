import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');

  const fetchTasks = async () => {
    try {
      const res = await taskAPI.getAll(filter || undefined);
      setTasks(res.data.data.tasks);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('pending');
    setEditingTask(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingTask) {
        await taskAPI.update(editingTask._id, { title, description, status });
        toast.success('Task updated!');
      } else {
        await taskAPI.create({ title, description, status });
        toast.success('Task created!');
      }
      resetForm();
      fetchTasks();
    } catch (error) {
      const message = error.response?.data?.message || 'Operation failed';
      toast.error(message);
    }
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description || '');
    setStatus(task.status);
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskAPI.delete(id);
      toast.success('Task deleted!');
      fetchTasks();
    } catch (error) {
      const message = error.response?.data?.message || 'Delete failed';
      toast.error(message);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: '#ffc107',
      'in-progress': '#17a2b8',
      completed: '#28a745',
    };
    return (
      <span className="badge" style={{ backgroundColor: colors[status] }}>
        {status}
      </span>
    );
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}! 👋</h1>
        <p>Manage your tasks below</p>
      </div>

      <div className="dashboard-controls">
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Task'}
        </button>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
          <option value="">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {showForm && (
        <div className="task-form-card">
          <h3>{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description (optional)"
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingTask ? 'Update Task' : 'Create Task'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="tasks-grid">
        {tasks.length === 0 ? (
          <div className="no-tasks">
            <p>No tasks found. Create your first task!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="task-card">
              <div className="task-header">
                <h3>{task.title}</h3>
                {getStatusBadge(task.status)}
              </div>
              {task.description && <p className="task-desc">{task.description}</p>}
              <div className="task-meta">
                <small>Created: {new Date(task.createdAt).toLocaleDateString()}</small>
              </div>
              <div className="task-actions">
                <button className="btn btn-sm btn-edit" onClick={() => handleEdit(task)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-delete" onClick={() => handleDelete(task._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
