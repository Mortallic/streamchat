import { useState, useEffect, useRef } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import messagesService from '../services/messages';
import './ChatBox.css';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const chatBoxRef = useRef(null);

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

    // Subscribe to real-time updates
    const unsubscribe = messagesService.subscribe((response) => {
      console.log('Realtime response:', response);
      
      if (response.events.includes('databases.*.collections.*.documents.*.create')) {
        // Handle new message
        const newMessage = response.payload;
        setMessages(prevMessages => [...prevMessages, newMessage]);
      }
      
      if (response.events.includes('databases.*.collections.*.documents.*.update')) {
        // Handle message update
        const updatedMessage = response.payload;
        setMessages(prevMessages => 
          prevMessages.map(message => 
            message.$id === updatedMessage.$id ? updatedMessage : message
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