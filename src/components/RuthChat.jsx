import { useState } from 'react'
import { X, Send, Bot, Sparkles } from 'lucide-react'
import './RuthChat.css'

const RuthChat = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ruth',
      text: "Hi! I'm Ruth, your AI assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])

  const quickReplies = [
    "What skills are needed for the Power BI role?",
    "Am I qualified for job #104?",
    "Find me backend roles",
    "Show me recommended jobs"
  ]

  const handleSend = () => {
    if (!message.trim()) return

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, newMessage])
    setMessage('')

    // Mock AI response
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        type: 'ruth',
        text: generateMockResponse(message),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, response])
    }, 1000)
  }

  const generateMockResponse = (userMessage) => {
    const responses = [
      "Based on your profile, I found 3 roles that match your skills perfectly. Would you like me to show them?",
      "The Power BI role requires experience with data visualization, SQL, and business intelligence. You have 85% skill match!",
      "I've found 5 backend positions that align with your Python and Node.js experience. Shall I apply you to the top matches?",
      "Great question! Let me analyze the job requirements against your profile..."
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleQuickReply = (reply) => {
    setMessage(reply)
  }

  if (!isOpen) return null

  return (
    <div className="ruth-chat-overlay">
      <div className="ruth-chat-modal">
        <div className="chat-header">
          <div className="chat-title">
            <div className="ruth-avatar">
              <Bot size={20} />
              <Sparkles size={12} className="ai-sparkle" />
            </div>
            <div>
              <h3>Ruth AI Assistant</h3>
              <span className="status">Online</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.type}`}>
              <div className="message-content">
                {msg.text}
              </div>
              <div className="message-time">{msg.time}</div>
            </div>
          ))}
        </div>

        <div className="quick-replies">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              className="quick-reply"
              onClick={() => handleQuickReply(reply)}
            >
              {reply}
            </button>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask Ruth anything..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="send-btn" onClick={handleSend}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default RuthChat