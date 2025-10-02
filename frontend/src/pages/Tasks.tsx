import {
  Box,
  Divider,
  List,
  ListItem,
  IconButton,
  ListItemAvatar,
  ListItemText,
  Typography,
  Chip,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Pagination,
} from '@mui/material'
import EditNote from '@mui/icons-material/EditNote'
import DeleteForever from '@mui/icons-material/DeleteForever'
import { useState, useEffect, Fragment } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

import { dict, req } from '../utils/api'
import type { Task, TaskRecord, User } from 'shared'
import AddTask from '@mui/icons-material/AddTask'
import CreateNewFolder from '@mui/icons-material/CreateNewFolder'
import AssignmentTurnedIn from '@mui/icons-material/AssignmentTurnedIn'
import DoNotDisturb from '@mui/icons-material/DoNotDisturb'

export type TasksProps = {
  user?: User | null
}

const taskStatusMap: Record<
  string,
  { color: 'success' | 'warning' | 'default'; label: string }
> = {
  active: { color: 'success', label: '进行中' },
  editing: { color: 'warning', label: '编辑中' },
  ended: { color: 'default', label: '已结束' },
}
const taskTypeMap = {
  normal: '普通任务',
  reward: '奖励任务',
  punish: '惩罚任务',
}

function TaskView({ role }: { role: 'admin' | 'normal' }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [msg, setMsg] = useState('')
  const [opt, setOpt] = useState<{ id: number; status: string } | null>(null)

  useEffect(() => {
    // 管理员时请求任务列表
    req(dict.listTasks, { method: 'GET' }).then((res) => {
      if (res) {
        setTasks(res.tasks)
      }
    })
  }, [role])

  const confirmToNextStatus = (tid: number, nxtStatus: string) => {
    let msg = ''
    if (nxtStatus === 'active') {
      msg = '确认启用该任务？'
    } else if (nxtStatus === 'ended') {
      msg = '确认终止该任务？'
    } else {
      return
    }
    setOpt({ id: tid, status: nxtStatus })
    setMsg(msg)
    setConfirmOpen(true)
  }

  return (
    <Fragment>
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="update-status-title"
        aria-describedby="update-status-description"
      >
        <DialogTitle id="update-status-title">{msg}</DialogTitle>
        <DialogContent>
          <DialogContentText id="update-status-description">
            任务状态更新后无法回退，是否仍要更新？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} autoFocus>
            取消
          </Button>
          <Button
            onClick={async () => {
              if (opt) {
                const res = await req(dict.updateTask, {
                  method: 'PUT',
                  body: JSON.stringify(opt),
                })
                // 完成后刷新当前页面
                if (res && !res.errno) {
                  setTasks((prev) =>
                    prev.map((t) =>
                      t.id === opt.id
                        ? { ...t, status: opt.status as 'active' | 'ended' }
                        : t
                    )
                  )
                }
                setOpt(null)
              }
              setConfirmOpen(false)
            }}
          >
            更新
          </Button>
        </DialogActions>
      </Dialog>
      <List sx={{ width: '100%', bgcolor: 'background.paper', mb: 2 }}>
        {tasks
          ?.filter((task) => role === 'admin' || task.status === 'active')
          .map((task) => (
            <Fragment key={task.id}>
              <ListItem alignItems="flex-start">
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
                    {task.id}
                  </Box>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1}>
                      <span>{task.title}</span>
                      <Chip
                        label={taskStatusMap[task.status].label}
                        size="small"
                        color={taskStatusMap[task.status].color}
                        variant="outlined"
                      />
                    </Stack>
                  }
                  secondary={
                    <Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ color: 'text.primary', display: 'inline' }}
                      >
                        {taskTypeMap[task.type]} - {task.desc}
                      </Typography>
                    </Fragment>
                  }
                />
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    position: 'absolute',
                    right: 16,
                    top: '25%',
                  }}
                >
                  {role === 'admin' && task.status !== 'ended' && (
                    <Fragment>
                      <Link to={`/task_info?id=${task.id}`}>
                        <IconButton
                          aria-label="编辑任务"
                          sx={{
                            height: 30,
                            width: 30,
                            p: 0,
                            bgcolor: 'white',
                            color: 'primary.main',
                          }}
                        >
                          <EditNote />
                        </IconButton>
                      </Link>
                      <IconButton
                        aria-label="修改任务状态"
                        sx={{
                          height: 30,
                          width: 30,
                          bgcolor: 'white',
                          p: 0,
                          color:
                            task.status === 'editing'
                              ? 'success.main'
                              : 'error.main',
                        }}
                        onClick={() => {
                          const nxtStatus =
                            task.status === 'editing' ? 'active' : 'ended'
                          confirmToNextStatus(task.id, nxtStatus)
                        }}
                      >
                        {task.status === 'editing' && <AssignmentTurnedIn />}
                        {task.status === 'active' && <DoNotDisturb />}
                      </IconButton>
                    </Fragment>
                  )}
                </Box>
              </ListItem>
              <Divider variant="inset" component="li" />
            </Fragment>
          ))}
      </List>

      {role === 'admin' && (
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Link to="/task_info">
            <Button
              fullWidth
              startIcon={<CreateNewFolder />}
              variant="contained"
            >
              创建任务
            </Button>
          </Link>
          <Link to="/new_record">
            <Button
              fullWidth
              startIcon={<AddTask />}
              variant="contained"
              sx={{
                bgcolor: 'success.main',
              }}
            >
              新增结算
            </Button>
          </Link>
        </Stack>
      )}
    </Fragment>
  )
}

function RecordView({
  recordUid,
  user,
  filterStatus,
}: {
  recordUid: number | null
  user: User | null
  filterStatus: string
}) {
  const [page, setPage] = useState<number>(0)
  const [tasks, setTasks] = useState<{ [key: number]: Task }>({})
  const [records, setRecords] = useState<TaskRecord[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [toDeleteRecId, setToDeleteRecId] = useState<number | null>(null)
  const [cnt, setCnt] = useState(0)

  const readableDate = (rawDate: Date) => {
    const date = new Date(rawDate)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  useEffect(() => {
    // 普通用户时请求自己的任务列表
    req(
      dict.pageRecords +
        `?uid=${recordUid}&status=${filterStatus}&page=${page}`,
      {
        method: 'GET',
      }
    ).then((res) => {
      if (res) {
        const newTasks = {} as { [key: number]: Task }
        res.tasks.forEach((t: Task) => {
          newTasks[t.id] = t
        })
        setTasks(newTasks)
        setRecords(res.records)
        setCnt(res.cnt || 0)
      }
    })
  }, [user, recordUid, filterStatus, page])

  const deleteRecord = function (rollback: boolean = true) {
    if (toDeleteRecId) {
      req(dict.deleteRecord + `?id=${toDeleteRecId}&rollback=${rollback}`, {
        method: 'DELETE',
      }).then(() => {
        setRecords((prev) => prev.filter((r) => r.id !== toDeleteRecId))
        setToDeleteRecId(null)
        setDialogOpen(false)
      })
    }
  }

  return (
    <Fragment>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">确定删除记录？</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            删除后将无法恢复，如果回滚奖励则会将对应的积分从指定用户中扣除（负数则会加回）。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>取消</Button>
          <Button onClick={() => deleteRecord(true)} autoFocus>
            删除并回滚
          </Button>
          <Button onClick={() => deleteRecord(false)} autoFocus>
            仅删除
          </Button>
        </DialogActions>
      </Dialog>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {records.map((rec) => (
          <Fragment key={rec.id}>
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                user && user.role === 'admin' && filterStatus === 'ended' ? (
                  <IconButton
                    aria-label="删除记录"
                    sx={{
                      height: 50,
                      width: 50,
                      color: 'error.main',
                    }}
                    onClick={() => {
                      setToDeleteRecId(rec.id)
                      setDialogOpen(true)
                    }}
                  >
                    <DeleteForever />
                  </IconButton>
                ) : null
              }
            >
              <ListItemText
                primary={
                  <Stack direction="row" spacing={1}>
                    <Typography variant="subtitle1">
                      {tasks[rec.taskId]?.title}
                    </Typography>
                    <Chip
                      label={rec.status === 'failed' ? '失败' : '完成'}
                      color={rec.status === 'failed' ? 'error' : 'success'}
                      variant="outlined"
                      size="small"
                    />
                  </Stack>
                }
                secondary={
                  <Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        color: 'text.primary',
                        display: 'block',
                        fontSize: 12,
                      }}
                    >
                      {rec.remark} - 得{rec.score}分
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        color: 'text.primary',
                        display: 'block',
                        fontSize: 12,
                      }}
                    >
                      获{rec.pointsAwarded}点数，结算折扣:{rec.ratio}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary', display: 'block' }}
                    >
                      {readableDate(rec.createTime)}
                    </Typography>
                  </Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />
          </Fragment>
        ))}
      </List>

      <Pagination
        count={cnt / 20 + (cnt % 20 === 0 ? 0 : 1)}
        color="primary"
        sx={{ my: 2 }}
        page={page + 1}
        onChange={(_, val) => setPage(val - 1)}
      />
      {user && user.role === 'admin' && filterStatus === 'ended' && (
        <Link to="/new_record">
          <Button
            fullWidth
            startIcon={<AddTask />}
            variant="contained"
            sx={{
              bgcolor: 'success.main',
              mb: 2,
            }}
          >
            新增结算
          </Button>
        </Link>
      )}
    </Fragment>
  )
}

export default function Tasks({ user }: TasksProps) {
  const [viewType, setViewType] = useState<'tasks' | 'records'>('tasks')
  const [recordUid, setRecordUid] = useState<number | undefined>()
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchParams, setSearchParams] = useSearchParams()
  const [uname, setUname] = useState<string>('全部')

  useEffect(() => {
    // 从 URL 中提取 role 和 uid
    const role = searchParams.get('role') || user?.role
    // console.log('params:', searchParams)
    if (role === 'normal' && searchParams.get('status') === 'ended') {
      setViewType('records')
      setRecordUid(parseInt(searchParams.get('uid') || '', 10) || undefined)
      setFilterStatus(searchParams.get('status') || 'active')
    } else {
      setViewType('tasks')
      setRecordUid(undefined)
      setFilterStatus(
        role === 'admin' && !searchParams.get('status') ? 'all' : 'active'
      )
      // console.log('set filterStatus to', filterStatus)
    }

    if (user && user.id === recordUid) {
      setUname(user.uname + '的')
    } else if (recordUid) {
      // 请求该用户信息
      req(dict.getUser + `?uid=${recordUid}`, { method: 'GET' }).then((res) => {
        if (res.user) {
          setUname(res.user.uname + '的')
        }
      })
    }
  }, [user, searchParams, recordUid, filterStatus])

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="subtitle1" sx={{ p: 1 }}>
          {uname}任务列表
        </Typography>
        {filterStatus !== 'all' && (
          <ToggleButtonGroup
            size="small"
            color="primary"
            sx={{ p: 1 }}
            value={filterStatus}
            exclusive
            onChange={(_, val) => {
              if (val) {
                const newParams = new URLSearchParams(searchParams)
                newParams.set('status', val)
                newParams.set('page', '0')
                setSearchParams(newParams)
              }
            }}
            aria-label="Platform"
          >
            <ToggleButton sx={{ py: 0 }} value="active">
              进行中
            </ToggleButton>
            <ToggleButton sx={{ py: 0 }} value="ended">
              已结算
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      </Box>
      {viewType === 'tasks' ? (
        <TaskView role={filterStatus === 'all' ? 'admin' : 'normal'} />
      ) : (
        <RecordView
          recordUid={recordUid!}
          user={user || null}
          filterStatus={filterStatus}
        />
      )}
    </>
  )
}
