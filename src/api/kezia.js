const KEZIA_API_URL = import.meta.env.VITE_KEZIA_API_URL

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