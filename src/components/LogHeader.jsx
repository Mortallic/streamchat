import { useNavigate } from 'react-router-dom';
import './LogHeader.css';

function LogHeader({ username, banCount }) {
  const navigate = useNavigate();

  return (
    <div className="log-header">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back
      </button>
      <div className="user-info">
        <h1>Message History for {username}</h1>
        <div className="ban-info">
          Times Banned: <span className="ban-count">{banCount}</span>
        </div>
      </div>
    </div>
  );
}

export default LogHeader; 