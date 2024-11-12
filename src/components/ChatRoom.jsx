import Header from './Header'
import ChatBox from './ChatBox'
import MessageInput from './MessageInput'
import './ChatRoom.css'

function ChatRoom() {
  return (
    <div className="chat-room">
      <Header />
      <ChatBox />
      <MessageInput />
    </div>
  )
}

export default ChatRoom 