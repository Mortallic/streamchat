import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/auth';
import LogHeader from './LogHeader.jsx';
import Logs from './Logs';
import './ChatRoom.css'

function LogsPage() {
  const { username } = useParams();
  const { user } = useAuth();
  const [targetUserId, setTargetUserId] = useState(null);

  useEffect(() => {
    const fetchUserIdByUsername = async () => {
      try {
        const profile = await authService.getUserProfileByName(username);
        if (profile) {
          setTargetUserId(profile.userId);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUserIdByUsername();
  }, [username]);

  return (
    <div className="chat-room">
      <LogHeader username={username} />
      {targetUserId && <Logs userId={targetUserId} />}
    </div>
  )
}

export default LogsPage 