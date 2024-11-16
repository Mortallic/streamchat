import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/auth';
import messagesService from '../services/messages';
import './Message.css';
import { useNavigate } from 'react-router-dom';
import { formatTime, formatFullDate } from '../utils/dateUtils';

function Message({ messageId, timestamp, username, content, userId, isCensored, showFullDate = false }) {
  const [userColor, setUserColor] = useState('#4d9eff');
  const [userBadge, setUserBadge] = useState(null);
  const [showModMenu, setShowModMenu] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await authService.getUserProfile(userId);
        if (profile?.color) {
          setUserColor(profile.color);
        }
        if (profile?.badge) {
          setUserBadge(profile.badge);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleCensor = async () => {
    try {
      await messagesService.censorMessage(messageId);
      setShowModMenu(false);
    } catch (error) {
      console.error('Error censoring message:', error);
    }
  };

  const handleTimeout = async (minutes) => {
    try {
      await authService.timeoutUser(userId, minutes);
      setShowModMenu(false);
    } catch (error) {
      console.error('Error timing out user:', error);
    }
  };

  const handleBan = async () => {
    try {
      await authService.banUser(userId);
      setShowModMenu(false);
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };

  const handleModMenuClick = (e) => {
    e.stopPropagation();
  };

  const getBadgeEmoji = (badge) => {
    switch (badge) {
      case 'admin':
        return '👑'; // Crown for admin
      case 'mod':
        return '⚔️'; // Crossed swords for mod
      case 'vip':
        return '⭐'; // Star for VIP
      default:
        return null;
    }
  };

  return (
    <div className={`message ${isCensored ? 'message-censored' : ''}`}>
      <div className="message-content-wrapper">
        <span className="message-time">
          {showFullDate ? formatFullDate(timestamp) : ''}
        </span>
        <span className="user-badge-wrapper">
          {userBadge && (
            <span 
              className={`user-badge ${userBadge}`} 
              title={userBadge.toUpperCase()}
            >
              {getBadgeEmoji(userBadge)}
            </span>
          )}
          <span 
            className="message-user" 
            style={{ color: userColor }}
            onClick={() => navigate(`/logs/${username}`)}
          >
            {username}
          </span>
        </span>
        <span className="message-content">
          {isCensored ? <em>Message deleted</em> : content}
        </span>
      </div>
      {user?.profile?.isMod && (
        <div className="mod-actions">
          <button 
            className="message-mod-button"
            onClick={() => setShowModMenu(!showModMenu)}
            title="Mod actions"
          >
            🚨
          </button>
          {showModMenu && (
            <div 
              className="mod-menu"
              onClick={handleModMenuClick}
            >
              <button onClick={handleCensor}>Delete Message</button>
              <button onClick={() => handleTimeout(5)}>Timeout 5m</button>
              <button onClick={() => handleTimeout(10)}>Timeout 10m</button>
              <button onClick={() => handleTimeout(30)}>Timeout 30m</button>
              <button onClick={handleBan} className="ban-button">Ban User</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Message; 