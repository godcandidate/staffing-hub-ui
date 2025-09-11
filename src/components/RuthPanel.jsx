import { useState, useEffect, useRef } from 'react'
import { X, Send, MessageCircle, Minimize2 } from 'lucide-react'
import { ruthAPI } from '../api/ruth'
import './RuthPanel.css'

const RuthPanel = ({ isOpen, onClose, jobId }) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ruth',
      text: "Hi! I'm Ruth. I can help answer questions about this specific job role. What would you like to know?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [currentResponse, setCurrentResponse] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef(null)
  const wsRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Dispatch custom event to notify Layout component
    window.dispatchEvent(new CustomEvent('ruthChatToggle', { 
      detail: { isOpen } 
    }))
    
    if (isOpen) {
      // Initialize WebSocket connection
      wsRef.current = ruthAPI.createConnection()
      
      wsRef.current.onopen = () => {
        setIsConnected(true)
      }
      
      wsRef.current.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data)
          if (response.mime_type === 'text/plain' && response.data) {
            handleWebSocketMessage(response)
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }
      
      wsRef.current.onclose = () => {
        setIsConnected(false)
      }
      
      wsRef.current.onerror = () => {
        setIsConnected(false)
      }
    } else {
      // Close WebSocket connection
      if (wsRef.current) {
        wsRef.current.close()
      }
      setIsConnected(false)
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [isOpen])

  const handleWebSocketMessage = (response) => {
    if (response.is_final_response === false) {
      // Streaming response - append to current response
      setCurrentResponse(prev => prev + response.data)
    } else {
      // Final response or single message
      const finalText = currentResponse + response.data
      const ruthResponse = {
        id: Date.now(),
        type: 'ruth',
        text: finalText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, ruthResponse])
      setCurrentResponse('')
      setIsTyping(false)
    }
  }

  const handleSend = () => {
    if (!message.trim() || !isConnected) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsTyping(true)
    setCurrentResponse('')

    // Send via WebSocket
    ruthAPI.sendMessage(wsRef.current, userMessage.text, jobId)
  }

  if (!isOpen) return null

  return (
    <div className="ruth-panel-overlay">
      <div className={`ruth-panel ${isMinimized ? 'minimized' : ''}`}>
        <div className="ruth-panel-header">
          <div className="ruth-panel-title">
            <MessageCircle size={20} className="ruth-icon" />
            <div>
              <h3>Ruth</h3>
              <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
                {isConnected ? 'Connected' : 'Connecting...'}
              </span>
            </div>
          </div>
          <div className="ruth-panel-controls">
            <button 
              className="control-btn" 
              onClick={() => setIsMinimized(!isMinimized)}
              title={isMinimized ? "Maximize" : "Minimize"}
            >
              <Minimize2 size={16} />
            </button>
            <button className="control-btn close" onClick={onClose} title="Close">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="ruth-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`ruth-message ${msg.type}`}>
              <div className="ruth-message-content">
                {msg.text}
              </div>
              <div className="ruth-message-time">{msg.time}</div>
            </div>
          ))}
          
          {isTyping && (
            <div className="ruth-message ruth">
              <div className="ruth-message-content typing">
                {currentResponse ? (
                  <div className="streaming-text">{currentResponse}</div>
                ) : (
                  <div className="ruth-typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="ruth-input-area">
          <div className="ruth-input-container">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask Ruth about this role..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="ruth-input"
            />
            <button 
              className="ruth-send-btn" 
              onClick={handleSend}
              disabled={!message.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RuthPanel