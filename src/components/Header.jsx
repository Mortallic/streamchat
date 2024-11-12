import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/auth';
import './Header.css';

function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="chat-header">
      <h1>Stream Chat</h1>
      <div className="user-info">
        {user ? (
          <div className="user-menu">
            <span className="username">{user.profile?.name}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="login-link">Login</Link>
            <Link to="/register" className="register-link">Register</Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header; 