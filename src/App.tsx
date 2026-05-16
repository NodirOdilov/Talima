import { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AppRouter } from '@/core/routing/AppRouter'
import { useAuthStore } from '@/store/authStore'

function App() {
  const restoreSession = useAuthStore((s) => s.restoreSession)

  // Восстановление сессии при загрузке приложения
  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  return (
    <Router basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <AppRouter />
    </Router>
  )
}

export default App
