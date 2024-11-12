import { useState } from 'react';
import authService from '../services/auth';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await authService.createAccount(email, password, name);
            await authService.login(email, password);
            navigate('/');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleRegister}>
                <h2>Register</h2>
                {error && <div className="auth-error">{error}</div>}
                
                <div className="form-group">
                    <label htmlFor="name">Username</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

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

                <button type="submit" className="auth-button">Register</button>
                
                <p className="auth-switch">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </form>
        </div>
    );
}

export default Register; 