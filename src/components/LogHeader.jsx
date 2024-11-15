import { useNavigate } from 'react-router-dom';
import './LogHeader.css';

function LogHeader({ username }) {
  const navigate = useNavigate();

  return (
    <div className="log-header">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back
      </button>
      <h1>Message History for {username}</h1>
    </div>
  );
}

export default LogHeader; 