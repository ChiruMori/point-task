import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Tasks from './pages/Tasks'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

function App() {
  const [serverStatus, setServerStatus] = useState('Checking...')
  const [token, setToken] = useState<string | null>(null)

  // token 无效，展示 Login 组件

  useEffect(() => {
    fetch('/api/health') // 注意这里直接写 /api，Vite会自动代理
      .then((res) => res.json())
      .then((data) => setServerStatus(`Server is ${data.status}`))
      .catch(() => setServerStatus('Failed to connect to server'))
  }, [])

  return (
    <>
      {!token && <Login setToken={setToken} />}
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Tasks</Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/" element={<Tasks />} />
          </Routes>
        </div>
      </Router>
      <div className="card">
        <p>Backend Status: {serverStatus}</p>
      </div>
    </>
  )
}

export default App
