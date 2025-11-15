import { useEffect } from 'react'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Snackbar,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AddTask from '@mui/icons-material/AddTask'
import type { Task, User } from 'shared'
import { dict, req } from '../utils/api'

// 新增完成记录页面
export default function RecordDetail() {
  const [taskIdx, setTaskIdx] = useState<string>('')
  const [userIdx, setUserIdx] = useState<string>('')
  const [score, setScore] = useState<string>('')
  const [ratio, setRatio] = useState<number>(1.0)
  const [total, setTotal] = useState<number>(0)
  const [remark, setRemark] = useState<string>('')
  const [scoreErr, setScoreErr] = useState('')
  const [taskStatus, setTaskStatus] = useState<'failed' | 'completed'>(
    'completed'
  )
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // 获取全部任务
    req(dict.listTasks, { method: 'GET' }).then((res) => {
      if (res && res.tasks) {
        setTasks(res.tasks)
      }
    })
    // 获取全部用户
    req(dict.listUsers, { method: 'GET' }).then((res) => {
      if (res && res.users) {
        setUsers(res.users)
      }
    })
  }, [])

  useEffect(() => {
    // 计算总分
    const rewardId = taskIdx !== '' ? tasks[parseInt(taskIdx)]?.rewardId : null
    if (rewardId === null || score === '' || isNaN(parseFloat(score))) {
      return
    }
    // 请求后端计算奖励
    req(`${dict.calculateReward}?id=${rewardId}&input=${score}`, {
      method: 'GET',
    }).then((res) => {
      if (res && res.message) {
        setScoreErr(res.message)
      } else if (res) {
        setTotal(res.result * ratio)
        setScoreErr('')
      }
    })
  }, [taskIdx, score, ratio, tasks])

  const createRecord = function () {
    if (
      taskIdx === '' ||
      userIdx === '' ||
      score === '' ||
      isNaN(parseFloat(score)) ||
      scoreErr !== ''
    ) {
      setMsg('请检查输入项')
      return
    }
    req(dict.createRecord, {
      method: 'POST',
      body: JSON.stringify({
        taskId: tasks[parseInt(taskIdx)]?.id,
        userId: users[parseInt(userIdx)]?.id,
        score: parseFloat(score),
        pointsAwarded: total,
        ratio,
        remark,
        status: taskStatus,
      }),
    }).then((res) => {
      if (res && res.errno) {
        console.error(res)
      } else {
        // 回到首页
        navigate('/')
      }
    })
  }

  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      <Snackbar
        open={msg !== ''}
        autoHideDuration={6000}
        onClose={() => setMsg('')}
        message={msg}
      />
      <FormControl variant="standard" sx={{ width: '100%' }}>
        <InputLabel id="task-sel-label">选择任务</InputLabel>
        <Select
          labelId="task-sel-label"
          id="task-sel"
          value={taskIdx}
          onChange={(e) => setTaskIdx(e.target.value)}
          label="任务"
        >
          {tasks.map((task, idx) => (
            <MenuItem key={task.id} value={idx}>
              {task.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="standard" sx={{ width: '100%' }}>
        <InputLabel id="user-sel-label">选择用户</InputLabel>
        <Select
          labelId="user-sel-label"
          id="user-sel"
          value={userIdx}
          onChange={(e) => setUserIdx(e.target.value)}
          label="用户"
        >
          {users.map((user, idx) => (
            <MenuItem key={user.id} value={idx}>
              {user.uname}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <FormControl variant="standard" sx={{ width: '100%' }}>
          <TextField
            id="score-field"
            label="分数"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            type="number"
            variant="standard"
            error={scoreErr !== ''}
            helperText={scoreErr}
          />
        </FormControl>
        <FormControl variant="standard" sx={{ width: '100%' }}>
          <TextField
            id="ratio-field"
            label="折扣比例"
            value={ratio}
            onChange={(e) => setRatio(parseFloat(e.target.value || '1.0'))}
            type="number"
            variant="standard"
          />
        </FormControl>
      </Stack>
      <FormControl variant="standard" sx={{ width: '100%' }}>
        <TextField
          id="total-field"
          label="获得点数"
          value={total}
          disabled
          type="number"
          variant="standard"
        />
      </FormControl>
      <FormControl variant="standard" sx={{ width: '100%' }}>
        <TextField
          id="remark-static"
          label="备注信息（完成原因、事项）"
          multiline
          rows={2}
          variant="standard"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
      </FormControl>

      <FormControl variant="standard" sx={{ width: '100%' }}>
        <FormControlLabel
          control={
            <Switch
              checked={taskStatus === 'completed'}
              onChange={(e) =>
                setTaskStatus(e.target.checked ? 'completed' : 'failed')
              }
            />
          }
          label={taskStatus === 'completed' ? '任务成功' : '任务失败'}
        />
      </FormControl>

      <Button
        fullWidth
        startIcon={<AddTask />}
        variant="contained"
        onClick={createRecord}
      >
        提交
      </Button>
    </Stack>
  )
}
