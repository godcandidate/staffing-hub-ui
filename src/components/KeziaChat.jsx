import { useState } from 'react'
import { X, Send, Bot, Sparkles } from 'lucide-react'
import { keziaAPI } from '../api/kezia'
import './KeziaChat.css'

const KeziaChat = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'kezia',
      text: "Hi! I'm Kezia, your AI assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])

  const quickReplies = [
    "How can I keep my skills fresh?",
    "How often should I update my CV?",
    "What should I do if I'm between projects?",
    "How can I stay informed about staffing opportunities?",
    "How does the Staffing Team ensure fairness?"
  ]

  const formatMessage = (text) => {
    return text
      .replace(/\n\n+/g, '</p><p><br>') // Multiple newlines become paragraph breaks
      .replace(/\n/g, '<br>') // Single newlines become line breaks
  }

  const handleSend = async (messageText = message) => {
    if (!messageText.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsLoading(true)

    try {
      const response = await keziaAPI.askQuestion(messageText)
      const responseText = response.response || response.message || response.answer || 'I received your question and will help you with that.'
      
      const keziaResponse = {
        id: Date.now() + 1,
        type: 'kezia',
        text: responseText,
        formattedText: `<p>${formatMessage(responseText)}</p>`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      
      setMessages(prev => [...prev, keziaResponse])
    } catch (error) {
      const errorResponse = {
        id: Date.now() + 1,
        type: 'kezia',
        text: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }



  const handleQuickReply = (reply) => {
    handleSend(reply)
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
              <h3>Kezia</h3>
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
              {msg.formattedText ? (
                <div 
                  className="message-content"
                  dangerouslySetInnerHTML={{ __html: msg.formattedText }}
                />
              ) : (
                <div className="message-content">
                  {msg.text}
                </div>
              )}
              <div className="message-time">{msg.time}</div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message kezia">
              <div className="message-content loading-message">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="loading-text">Kezia is thinking...</span>
              </div>
            </div>
          )}
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
            placeholder="Ask Kezia anything..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="send-btn" onClick={() => handleSend()} disabled={isLoading}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default KeziaChat