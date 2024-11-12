import { useState, useEffect, useRef } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import messagesService from '../services/messages';
import './ChatBox.css';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const chatBoxRef = useRef(null);
  const MESSAGE_LIMIT = 100;

  const fetchMessages = async () => {
    try {
      const fetchedMessages = await messagesService.getMessages();
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();

    const unsubscribe = messagesService.subscribe((event) => {
      if (event.type === 'create') {
        setMessages(prevMessages => {
          const newMessages = [...prevMessages, event.message];
          // Keep only the last 100 messages
          return newMessages.slice(-MESSAGE_LIMIT);
        });
      }
      
      if (event.type === 'update') {
        setMessages(prevMessages => 
          prevMessages.map(message => 
            message.$id === event.message.$id ? event.message : message
          )
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((message) => (
          <Message
            key={message.$id}
            messageId={message.$id}
            timestamp={message.timestamp}
            username={message.username}
            content={message.content}
            userId={message.userId}
            isCensored={message.isCensored}
          />
        ))}
      </div>
      <MessageInput />
    </div>
  );
}

export default ChatBox; 