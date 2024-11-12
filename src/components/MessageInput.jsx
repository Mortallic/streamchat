import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import messagesService from '../services/messages';
import authService from '../services/auth';
import './MessageInput.css';

function MessageInput() {
  const [message, setMessage] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { user, setUser } = useAuth();

  const colors = [
    '#4d9eff', // Blue
    '#ff4d4d', // Red
    '#4dff4d', // Green
    '#ff4dff', // Pink
    '#ffd700', // Gold
    '#ff8c00', // Orange
    '#9370db', // Purple
    '#00ffff'  // Cyan
  ];

  const handleColorChange = async (color) => {
    try {
      await messagesService.updateUserColor(user.$id, color);
      setUser(prev => ({
        ...prev,
        profile: { ...prev.profile, color }
      }));
      setShowColorPicker(false);
    } catch (error) {
      console.error('Error updating color:', error);
    }
  };

  const handleCommand = async (command, args) => {
    if (!user?.profile?.isMod) return false;

    try {
      switch (command) {
        case 'delete':
        case 'del':
          if (args[0]) {
            await messagesService.censorMessage(args[0]);
            return true;
          }
          break;

        case 'timeout':
        case 'to':
          if (args[0] && args[1]) {
            const userId = args[0];
            const minutes = parseInt(args[1]);
            if (!isNaN(minutes)) {
              await authService.timeoutUser(userId, minutes);
              return true;
            }
          }
          break;

        case 'ban':
          if (args[0]) {
            await authService.banUser(args[0]);
            return true;
          }
          break;

        case 'help':
          const helpMessage = `
Available commands:
/delete [messageId] - Delete a message
/del [messageId] - Short for delete
/timeout [userId] [minutes] - Timeout a user
/to [userId] [minutes] - Short for timeout
/ban [userId] - Ban a user
/help - Show this message
          `.trim();
          console.log(helpMessage);
          return true;

        default:
          return false;
      }
    } catch (error) {
      console.error('Error executing command:', error);
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    try {
      // Check if message is a command
      if (message.startsWith('/')) {
        const [command, ...args] = message.slice(1).split(' ');
        const handled = await handleCommand(command.toLowerCase(), args);
        if (handled) {
          setMessage('');
          return;
        }
      }

      // If not a command or command failed, send as regular message
      await messagesService.sendMessage(
        message,
        user.$id,
        user.profile?.name || user.$id,
        user.profile?.color || '#4d9eff'
      );
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="message-input-container">
      <form className="message-input" onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="input-actions">
          <button 
            type="button" 
            className="color-picker-button"
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            <div 
              className="color-preview" 
              style={{ backgroundColor: user?.profile?.color || '#4d9eff' }}
            />
          </button>
          <button type="submit">Send</button>
        </div>
      </form>
      
      {showColorPicker && (
        <div className="color-picker">
          {colors.map((color) => (
            <button
              key={color}
              className="color-option"
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MessageInput; 