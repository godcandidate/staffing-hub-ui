const KEZIA_API_URL = 'https://lkjp1q7qh4.execute-api.us-west-2.amazonaws.com/ask_staffing_question'

export const keziaAPI = {
  askQuestion: async (message) => {
    const response = await fetch(KEZIA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get response from Kezia')
    }

    return data
  }
}