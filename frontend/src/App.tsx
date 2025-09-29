import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Tasks from './pages/Tasks'
import type { User } from 'shared'
import './App.scss'

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import { dict, req } from './utils/api'
import Users from './pages/Users'
function App() {
  // const [serverStatus, setServerStatus] = useState('Checking...')
  const [token, setToken] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)

  const routeDict = {
    tasks: { path: '/', label: '任务', element: <Tasks /> },
    users: { path: '/users', label: '管理', element: <Users user={user} /> },
  }

  useEffect(() => {
    // 首先获取当前用户信息
    if (token) {
      const fetchUser = async () => {
        const res = await req(dict.getUser, token, { method: 'GET' })
        if (res.user) {
          setUser(res.user as User)
        } else {
          console.error('Failed to fetch user:', res)
        }
      }
      fetchUser()
    }
  }, [token])

  return (
    <>
      {!token && <Login setToken={setToken} />}

      <Router>
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box sx={{ flexGrow: 1, display: 'inline-flex' }}>
                {Object.entries(routeDict).map(([key, { path, label }]) => (
                  <Link to={path} style={{ textDecoration: 'none' }} key={key}>
                    <Button
                      sx={{
                        color: 'white',
                        display: 'block',
                        borderColor: 'white',
                      }}
                    >
                      {label}
                    </Button>
                  </Link>
                ))}
              </Box>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <Typography
                    onClick={() => setMenuOpen(true)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {user?.uname || '...'}
                  </Typography>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={menuOpen}
                  onClose={() => setMenuOpen(false)}
                >
                  <MenuItem
                    onClick={() => {
                      setToken(null)
                      localStorage.removeItem('token')
                      setMenuOpen(false)
                    }}
                  >
                    <Typography sx={{ textAlign: 'center' }}>登 出</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        <Routes>
          {Object.entries(routeDict).map(([key, { path, element }]) => (
            <Route path={path} element={element} key={key} />
          ))}
        </Routes>
      </Router>
    </>
  )
}

export default App
