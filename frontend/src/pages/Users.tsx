import { Paper, Card, Grid, Stack, Typography, Divider } from '@mui/material'
import type { User } from 'shared'

export type UsersProps = {
  user: User | null
}

export default function Users({ user }: UsersProps) {
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
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            管理员操作
          </Typography>
        </Paper>
      )}
    </>
  )
}
