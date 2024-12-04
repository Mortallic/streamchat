import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/auth';
import LogHeader from './LogHeader.jsx';
import ModComment from './ModComment.jsx';
import Logs from './Logs';
import './ChatRoom.css'

function LogsPage() {
  const { username } = useParams();
  const [targetUserId, setTargetUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching data for username:', username);
        
        const profile = await authService.getUserProfileByName(username);
        console.log('Found profile:', profile);
        
        if (profile) {
          setUserProfile(profile);
          setTargetUserId(profile.userId);
        } else {
          setError('User not found');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Error loading user data');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [username]);

  if (loading) {
    return <div className="loading">Loading user data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!userProfile) {
    return <div className="error">User not found</div>;
  }

  return (
    <div className="chat-room">
      <LogHeader 
        username={username} 
        banCount={userProfile.bans || 0}
      />
      {userProfile.modComment && (
        <ModComment comment={userProfile.modComment} />
      )}
      {targetUserId && (
        <Logs 
          userId={targetUserId} 
          key={targetUserId}
        />
      )}
    </div>
  )
}

export default LogsPage 