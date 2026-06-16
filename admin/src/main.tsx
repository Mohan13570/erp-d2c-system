import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'

// Global API Error Interceptor
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  if (!response.ok && args[0].toString().startsWith('/api')) {
    try {
      const cloned = response.clone();
      const errData = await cloned.json();
      if (errData.error) {
        alert(`Action Failed: ${errData.error}`);
      }
    } catch (e) {
      alert(`System Error: ${response.status} ${response.statusText}`);
    }
  }
  return response;
};
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
