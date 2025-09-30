import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { setNavigateCallback, dict, req, registerToken } from './utils/api'
import Login from './pages/Login'
import Tasks from './pages/Tasks'
import Users from './pages/Users'
import type { User } from 'shared'
import './App.scss'
import RecordDetail from './pages/RecordDetail'
import TaskDetail from './pages/TaskDetail'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  )
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)

  const routeDict = {
    tasks: {
      path: '/',
      label: '任务',
      element: <Tasks user={user} />,
      nav: true,
    },
    users: {
      path: '/users',
      label: '管理',
      element: <Users user={user} />,
      nav: true,
    },
    newRecord: {
      path: '/new_record',
      label: '记录',
      element: <RecordDetail />,
      nav: false,
    },
    editTask: {
      path: '/task_info',
      label: '任务详情',
      element: <TaskDetail />,
      nav: false,
    }
  }

  // 设置 token 失效时的导航回调
  useEffect(() => {
    setNavigateCallback(() => {
      setToken(null)
      setUser(null)
      console.log('Navigated to login due to token invalidation.')
    })
    console.log('Navigate callback set.')
  }, [])

  useEffect(() => {
    // 同步 token 到 localStorage
    if (token) {
      localStorage.setItem('token', token)
      registerToken(token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  useEffect(() => {
    // 首先获取当前用户信息
    if (token) {
      const fetchUser = async () => {
        const res = await req(dict.getUser, { method: 'GET' })
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

      {token && (
        <Router>
          <AppBar position="static">
            <Container maxWidth="xl">
              <Toolbar disableGutters>
                <Box sx={{ flexGrow: 1, display: 'inline-flex' }}>
                  {Object.entries(routeDict)
                    .filter(([, { nav }]) => nav)
                    .map(([key, { path, label }]) => (
                      <Link
                        to={path}
                        style={{ textDecoration: 'none' }}
                        key={key}
                      >
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
                      <Typography sx={{ textAlign: 'center' }}>
                        登 出
                      </Typography>
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
      )}
    </>
  )
}

export default App
