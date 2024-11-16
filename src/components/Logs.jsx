import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import messagesService from '../services/messages';
import Message from './Message';
import './Logs.css';

function Logs({ userId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        const userMessages = await messagesService.getUserMessages(userId);
        setMessages(userMessages);
      } catch (error) {
        console.error('Error fetching user messages:', error);
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserMessages();
    }
  }, [userId]);

  if (loading) {
    return <div className="logs-loading">Loading messages...</div>;
  }

  if (error) {
    return (
      <div className="logs-error">
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Return to Chat</button>
      </div>
    );
  }

  return (
    <div className="logs-container">
      {messages.length === 0 ? (
        <div className="logs-empty">No messages found for this user.</div>
      ) : (
        messages.map((message) => (
          <Message
            key={message.$id}
            messageId={message.$id}
            timestamp={message.timestamp}
            username={message.username}
            content={message.content}
            userId={message.userId}
            isCensored={false}
            showFullDate={true}
          />
        ))
      )}
    </div>
  );
}

export default Logs;




