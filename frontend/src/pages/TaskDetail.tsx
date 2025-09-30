import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Reward, Task } from 'shared'
import { dict, req } from '../utils/api'
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  TextField,
} from '@mui/material'
import CreateNewFolder from '@mui/icons-material/CreateNewFolder'
import Source from '@mui/icons-material/Source'
import { useNavigate } from 'react-router-dom'

export default function TaskDetail() {
  const [searchParams] = useSearchParams()
  const [task, setTask] = useState<Task | null>(null)
  const [reward, setReward] = useState<Reward | null>(null)
  const [rewardUpdated, setRewardUpdated] = useState<boolean>(false)
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      const fetchData = async () => {
        // 获取任务详情
        const taskRes = await req(`${dict.getTask}?tid=${id}`, {
          method: 'GET',
        })
        if (taskRes && taskRes.task) {
          setTask(taskRes.task)
        }
        // 获取奖励详情
        const rewardRes = await req(
          `${dict.getReward}?id=${taskRes.task.rewardId}`,
          { method: 'GET' }
        )
        if (rewardRes && rewardRes.reward) {
          setReward(rewardRes.reward)
        }
      }
      fetchData()
    }
  }, [searchParams])

  const submitTask = async () => {
    if (
      !task ||
      !reward ||
      !task.title ||
      !task.type ||
      !reward.fx ||
      reward.minInput === undefined ||
      reward.maxInput === undefined ||
      !task.desc
    ) {
      setMsg('任务信息不完整')
      return
    }
    // 如果奖励信息有更新，先提交奖励信息
    if (rewardUpdated) {
      // 删除旧奖励
      if (reward.id) {
        await req(`${dict.deleteReward}?id=${reward.id}`, { method: 'DELETE' })
      }
      // 创建新奖励
      const newRewardRes = await req(dict.createReward, {
        method: 'POST',
        body: JSON.stringify({ ...reward, id: undefined }),
      })
      if (newRewardRes && newRewardRes.reward) {
        setReward(newRewardRes.reward)
        task.rewardId = newRewardRes.reward.id
      }
    }
    // 提交任务信息
    const url = task.id ? dict.updateTask : dict.createTask
    const method = task.id ? 'PUT' : 'POST'
    const res = await req(url, {
      method,
      body: JSON.stringify(task),
    })
    if (res && res.errno) {
      console.error('任务提交失败:', res)
      setMsg('任务提交失败')
      return
    }
    // 返回首页
    navigate('/')
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
        <TextField
          id="task-title"
          label="任务标题"
          value={task?.title || ''}
          type="text"
          variant="standard"
          onChange={(e) => {
            setTask({ ...task, title: e.target.value } as Task)
          }}
        />
      </FormControl>
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <FormControl variant="standard" sx={{ width: '100%' }}>
          <TextField
            id="min-score"
            label="最小可能得分"
            value={reward?.minInput || ''}
            onChange={(e) => {
              setReward({
                ...reward,
                minInput: parseFloat(e.target.value || '0'),
              } as Reward)
              setRewardUpdated(true)
            }}
            type="number"
            variant="standard"
          />
        </FormControl>
        <FormControl variant="standard" sx={{ width: '100%' }}>
          <TextField
            id="max-score"
            label="最大可能得分"
            value={reward?.maxInput || ''}
            onChange={(e) => {
              setReward({
                ...reward,
                maxInput: parseFloat(e.target.value || '100.0'),
              } as Reward)
              setRewardUpdated(true)
            }}
            type="number"
            variant="standard"
          />
        </FormControl>
      </Stack>
      <FormControl>
        <FormLabel id="task-type">任务类别</FormLabel>
        <RadioGroup
          row
          aria-labelledby="task-type"
          name="任务类别"
          value={task?.type || ''}
          onChange={(e) => {
            setTask({ ...task, type: e.target.value } as Task)
          }}
        >
          <FormControlLabel value="normal" control={<Radio />} label="普通" />
          <FormControlLabel value="reward" control={<Radio />} label="奖励" />
          <FormControlLabel value="punish" control={<Radio />} label="惩罚" />
        </RadioGroup>
      </FormControl>
      <FormControl variant="standard" sx={{ width: '100%' }}>
        <TextField
          id="task-desc"
          label="任务描述"
          multiline
          rows={2}
          variant="standard"
          value={task?.desc || ''}
          onChange={(e) => setTask({ ...task, desc: e.target.value } as Task)}
        />
      </FormControl>
      <FormControl variant="standard" sx={{ width: '100%' }}>
        <TextField
          id="reward-fx"
          label="奖励计算函数 f(x)"
          multiline
          rows={3}
          variant="standard"
          value={reward?.fx || ''}
          onChange={(e) => {
            setReward({ ...reward, fx: e.target.value } as Reward)
            setRewardUpdated(true)
          }}
        />
      </FormControl>

      <Button
        fullWidth
        startIcon={task && task.id ? <CreateNewFolder /> : <Source />}
        variant="contained"
        onClick={submitTask}
      >
        提交
      </Button>
    </Stack>
  )
}
