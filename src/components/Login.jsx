import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/auth';
import './Auth.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await authService.login(email, password);
            // Get current user after login
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            navigate('/');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleLogin}>
                <h2>Login</h2>
                {error && <div className="auth-error">{error}</div>}
                
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="auth-button">Login</button>
                
                <p className="auth-switch">
                    Don't have an account? <a href="/register">Register</a>
                </p>
            </form>
        </div>
    );
}

export default Login; 