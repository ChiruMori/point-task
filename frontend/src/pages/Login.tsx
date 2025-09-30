import { dict, registerToken } from '../utils/api'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'

export type LoginProps = {
  setToken: (token: string) => void
}

type TimeLimitedToken = {
  token: string
  deadline: number // Unix timestamp in milliseconds
}

function Login({ setToken }: LoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // 首先尝试从 localStorage 获取 token
    const timeLimitedToken = JSON.parse(
      localStorage.getItem('token') as string
    ) as TimeLimitedToken | null
    // 如果 token 存在且未过期，直接使用该 token
    if (timeLimitedToken) {
      const currentTime = Date.now()
      if (timeLimitedToken.deadline > currentTime) {
        console.log('Using stored token')
        setToken(timeLimitedToken.token)
        registerToken(timeLimitedToken.token)
        return
      }
      console.log('Stored token expired')
    } else {
      console.log('No stored token found')
    }
  }, [setToken])

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
          // 登录成功，存储 token 和过期时间（半小时后）
          const deadline = Date.now() + 30 * 60 * 1000
          const tokenData: TimeLimitedToken = {
            token: data.token,
            deadline,
          }
          localStorage.setItem('token', JSON.stringify(tokenData))
          registerToken(data.token)
          setToken(data.token)
        } else {
          setError(data.message || '登录失败')
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
        zIndex: 1000,
      }}
    >
      <Paper
        elevation={3}
        sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          fontWeight="bold"
          sx={{
            background: 'linear-gradient(45deg, #00AAFF 30%, #00FFAA 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Point-Task
        </Typography>
        <TextField
          id="outlined-basic"
          label="用户名"
          variant="outlined"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value)
            setError('')
          }}
        />
        <TextField
          id="outlined-basic"
          label="密码"
          variant="outlined"
          type="password"
          value={password}
          error={error !== ''}
          onChange={(e) => {
            setPassword(e.target.value)
            setError('')
          }}
          helperText={error}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleLogin(username, password)}
        >
          登 录
        </Button>
      </Paper>
    </Box>
  )
}

export default Login
