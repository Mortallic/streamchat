import { useState, useEffect } from 'react';
import Message from './Message';
import messagesService from '../services/messages';
import './Logs.css';

function Logs({ userId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const userMessages = await messagesService.getUserMessages(userId);
        setMessages(userMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMessages();
    }
  }, [userId]);

  if (loading) {
    return <div className="logs-loading">Loading messages...</div>;
  }

  return (
    <div className="logs-container">
      {messages.length === 0 ? (
        <div className="logs-empty">No messages found from this user.</div>
      ) : (
        messages.map((message) => (
          <Message
            key={message.$id}
            messageId={message.$id}
            timestamp={message.$createdAt}
            username={message.username}
            content={message.content}
            userId={message.userId}
            showFullDate={true}
          />
        ))
      )}
    </div>
  );
}

export default Logs;




