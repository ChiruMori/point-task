import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [serverStatus, setServerStatus] = useState('Checking...')

  useEffect(() => {
    fetch('/api/health') // 注意这里直接写 /api，Vite会自动代理
      .then((res) => res.json())
      .then((data) => setServerStatus(`Server is ${data.status}`))
      .catch(() => setServerStatus('Failed to connect to server'))
  }, [])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <h1>Task Incentive System</h1>
        <p>Backend Status: {serverStatus}</p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
