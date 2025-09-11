const RUTH_WS_URL = import.meta.env.VITE_RUTH_WS_URL || 'ws://44.248.50.194:6060/api/ai/chatbot/ws'

export const ruthAPI = {
  createConnection: (jobId) => {
    return new WebSocket(`${RUTH_WS_URL}/${jobId}`)
  },
  
  sendMessage: (ws, userQuery, jobId) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const payload = {
        user_query: userQuery,
        job_id: jobId
      }
      ws.send(JSON.stringify(payload))
      return true
    }
    return false
  }
}