import {
  List,
  ListItem,
  Card,
  Grid,
  Stack,
  Typography,
  Divider,
  ListItemAvatar,
  ListItemText,
  Box,
  IconButton,
} from '@mui/material'
import Checklist from '@mui/icons-material/Checklist'
import { Fragment } from 'react/jsx-runtime'
import type { User } from 'shared'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { dict, req } from '../utils/api'

export type UsersProps = {
  user: User | null
}

function Users({ user }: UsersProps) {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await req(dict.listUsers, { method: 'GET' })
      if (res) {
        setUsers(res.users)
      }
    }
    fetchUsers()
  }, [user])

  return (
    <>
      <Card sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid size={6}>
            <Typography sx={{ textAlign: 'center', color: 'gray' }}>
              点数
            </Typography>
            <Typography
              variant="h2"
              sx={{ pb: 2, textAlign: 'center', color: 'darkgoldenrod' }}
            >
              {user?.point}
            </Typography>
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid size={5}>
            <Stack spacing={2}>
              <p>ID: {user?.id}</p>
              <p>用户名：{user?.uname}</p>
              <p>权限：{user?.role}</p>
            </Stack>
          </Grid>
        </Grid>
      </Card>
      {user?.role === 'admin' && (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {users.map((u) => (
            <Fragment key={u.id}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  <Link to={`/?uid=${u.id}&status=ended&role=normal`}>
                    <IconButton
                      aria-label="查看任务详情"
                      sx={{
                        height: 50,
                        width: 50,
                        bgcolor: 'white',
                      }}
                    >
                      <Checklist />
                    </IconButton>
                  </Link>
                }
              >
                <ListItemAvatar>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: 'primary.main',
                      borderRadius: '50%',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {u.id}
                  </Box>
                </ListItemAvatar>
                <ListItemText
                  primary={u.uname}
                  secondary={
                    <Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ color: 'text.primary', display: 'inline' }}
                      >
                        {u.role}
                      </Typography>
                      <span style={{ color: 'lightgray' }}> | </span>
                      {'点数: '} {u.point}
                    </Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </Fragment>
          ))}
        </List>
      )}
    </>
  )
}

export default Users
