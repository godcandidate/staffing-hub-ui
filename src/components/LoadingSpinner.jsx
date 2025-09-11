export const LoadingSpinner = () => (
  <div className="loading-container" style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '200px',
    gap: '16px'
  }}>
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
)
