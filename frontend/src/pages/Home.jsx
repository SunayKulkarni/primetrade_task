import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <div className="hero">
        <h1>🚀 Task Manager</h1>
        <p>A simple and powerful way to manage your tasks</p>
        
        {user ? (
          <div className="hero-actions">
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Login
            </Link>
          </div>
        )}
      </div>

      <div className="features">
        <div className="feature-card">
          <span className="feature-icon">🔐</span>
          <h3>Secure Authentication</h3>
          <p>JWT-based authentication with role-based access control</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">📋</span>
          <h3>Task Management</h3>
          <p>Create, update, and delete tasks with ease</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">👤</span>
          <h3>Role-Based Access</h3>
          <p>Admin and user roles with different permissions</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
