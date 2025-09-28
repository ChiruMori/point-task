import { dict } from '../utils/api'
import Box from '@mui/material/Box'

export type LoginProps = {
  setToken: (token: string) => void
}

export default function Login({ setToken }: LoginProps) {
  const handleLogin = (username: string, password: string) => {
    fetch(dict.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          setToken(data.token)
        }
      })
      .catch((err) => {
        console.error('Login failed:', err)
      })
  }
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#f0f0f0',
      }}
    >
      <h2>Login Page</h2>
      <p>This is the login page. Implement your login form here.</p>
    </Box>
  )
}
