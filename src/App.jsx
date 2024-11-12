import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import ChatRoom from './components/ChatRoom';
import Login from './components/Login';
import Register from './components/Register';
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
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App; 