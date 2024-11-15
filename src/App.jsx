import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ChatRoom from './components/ChatRoom';
import Login from './components/Login';
import Register from './components/Register';
import LogsPage from './components/LogsPage';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Routes>
            <Route path="/" element={<ChatRoom />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logs/:username" element={<LogsPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App; 